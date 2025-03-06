#!/bin/bash
set -e

# Configuration
SERVICE_NAME="airys-video-test"
PROJECT_ID="airys-production"
REGION="us-central1"
TEST_BUCKET="airys-video-storage-test"
TEST_MODEL_BUCKET="airys-video-models-test"
SERVICE_URL=""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Test GPU functionality
test_gpu() {
    log "Testing GPU functionality..."
    
    # Get service logs to check for GPU initialization
    gpu_logs=$(gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=$SERVICE_NAME AND textPayload:NVIDIA" --limit 10 --format 'value(textPayload)')
    
    if echo "$gpu_logs" | grep -q "NVIDIA GPU initialization successful"; then
        success "GPU initialization verified"
    else
        error "GPU initialization failed or not detected"
    fi
    
    # Test model inference
    log "Testing model inference..."
    response=$(curl -s -X POST "$SERVICE_URL/api/test/inference" \
        -H "Content-Type: application/json" \
        -d '{"test_type": "gpu_inference"}')
    
    if echo "$response" | jq -e '.gpu_active == true' > /dev/null; then
        success "Model inference using GPU verified"
    else
        error "Model inference test failed"
    fi
}

# Test storage operations
test_storage() {
    log "Testing storage operations..."
    
    # Test bucket access
    gsutil ls "gs://$TEST_BUCKET" > /dev/null || error "Cannot access test bucket"
    success "Storage bucket access verified"
    
    # Upload test file
    echo "test content" > test.txt
    gsutil cp test.txt "gs://$TEST_BUCKET/test.txt"
    success "File upload successful"
    
    # Test file access through service
    response=$(curl -s -X GET "$SERVICE_URL/api/test/storage" \
        -H "Content-Type: application/json" \
        -d "{\"file_path\": \"test.txt\"}")
    
    if echo "$response" | jq -e '.access == true' > /dev/null; then
        success "Service storage access verified"
    else
        error "Service storage access failed"
    fi
    
    # Cleanup
    gsutil rm "gs://$TEST_BUCKET/test.txt"
    rm test.txt
}

# Monitor performance
monitor_performance() {
    log "Starting performance monitoring..."
    
    # Monitor CPU and memory usage
    log "Monitoring resource usage for 5 minutes..."
    end=$((SECONDS + 300))
    
    while [ $SECONDS -lt $end ]; do
        metrics=$(gcloud monitoring metrics list \
            --filter="metric.type = starts_with(\"run.googleapis.com/\")" \
            --format="value(metric.type)" \
            --project=$PROJECT_ID)
        
        for metric in $metrics; do
            gcloud monitoring metrics describe "$metric" \
                --format="value(metric.type,metric.labels)" \
                --project=$PROJECT_ID
        done
        
        sleep 60
    done
    
    success "Performance monitoring completed"
}

# Main execution
main() {
    log "Starting test suite for $SERVICE_NAME"
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)')
    
    # Run tests
    test_gpu
    test_storage
    monitor_performance
    
    success "All tests completed successfully"
}

# Execute main if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 