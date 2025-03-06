#!/bin/bash
set -e

# Configuration
PROJECT_ID="airys-production"
REGION="us-central1"
SERVICE_NAME="airys-video-test"
IMAGE_TAG="test"

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

# Setup test environment
setup_test_env() {
    log "Setting up test environment..."
    
    # Create test buckets if they don't exist
    for bucket in "airys-video-storage-test" "airys-video-models-test" "airys-video-temp-test"; do
        if ! gsutil ls -b "gs://$bucket" &>/dev/null; then
            log "Creating bucket: $bucket"
            gsutil mb -l $REGION "gs://$bucket"
        fi
    done
    
    # Create test secrets if they don't exist
    for secret in "frigate-rtsp-password-test" "frigate-config-test"; do
        if ! gcloud secrets describe "$secret" &>/dev/null; then
            log "Creating secret: $secret"
            echo "test-value" | gcloud secrets create "$secret" --data-file=-
        fi
    done
    
    success "Test environment setup completed"
}

# Build and push test image
build_test_image() {
    log "Building test image..."
    
    # Build the image
    docker build -t "gcr.io/$PROJECT_ID/airys-video:$IMAGE_TAG" \
        -f docker/cloud-run/Dockerfile \
        --build-arg ENVIRONMENT=test \
        .
    
    # Push to Container Registry
    docker push "gcr.io/$PROJECT_ID/airys-video:$IMAGE_TAG"
    
    success "Test image built and pushed"
}

# Deploy test service
deploy_test_service() {
    log "Deploying test service..."
    
    # Deploy using test configuration
    gcloud run services replace docker/cloud-run/test-deployment.yaml \
        --region=$REGION \
        --platform=managed
    
    # Wait for deployment to be ready by checking status
    log "Waiting for service to be ready..."
    while true; do
        status=$(gcloud run services describe $SERVICE_NAME \
            --region=$REGION \
            --format='get(status.conditions[0].status)')
        
        if [ "$status" = "True" ]; then
            break
        fi
        
        log "Service not ready yet, waiting..."
        sleep 10
    done
    
    success "Test service deployed"
}

# Verify deployment
verify_deployment() {
    log "Verifying deployment..."
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)')
    
    # Check if service is responding
    if curl -s -f "$SERVICE_URL/api/version" > /dev/null; then
        success "Service is responding"
    else
        error "Service is not responding"
    fi
    
    # Check GPU availability
    if curl -s -f "$SERVICE_URL/api/test/gpu" > /dev/null; then
        success "GPU is available"
    else
        error "GPU is not available"
    fi
}

# Main execution
main() {
    log "Starting test deployment for $SERVICE_NAME"
    
    setup_test_env
    build_test_image
    deploy_test_service
    verify_deployment
    
    success "Test deployment completed successfully"
    echo -e "\nTest service URL: $SERVICE_URL"
    echo "Run './run_tests.sh' to execute the test suite"
}

# Execute main if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 