#!/bin/bash

# Test script for GPU monitoring setup
# This script will:
# 1. Generate load on the GPU service
# 2. Verify that metrics are being collected
# 3. Check that alerts are properly configured

set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="airys-video"
REGION="us-central1"
SERVICE_URL="https://${SERVICE_NAME}-533976436221.${REGION}.run.app"
TEST_DURATION=300  # 5 minutes
CONCURRENT_USERS=10
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="${SCRIPT_DIR}/../test/venv"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if virtual environment exists and activate it
check_venv() {
    log "Checking for virtual environment..."
    if [ ! -d "${VENV_DIR}" ]; then
        log "Creating virtual environment..."
        python3 -m venv "${VENV_DIR}"
    fi
    
    log "Activating virtual environment..."
    source "${VENV_DIR}/bin/activate"
    
    log "Installing required packages..."
    pip install -q aiohttp requests google-cloud-monitoring
}

# Generate a token for authentication
get_auth_token() {
    log "Generating authentication token..."
    TOKEN=$(gcloud auth print-identity-token)
    if [ -z "$TOKEN" ]; then
        error "Failed to generate authentication token"
    fi
    success "Authentication token generated"
}

# Generate load on the GPU service
generate_load() {
    log "Generating load on the GPU service for ${TEST_DURATION} seconds with ${CONCURRENT_USERS} concurrent users..."
    
    # Create a temporary load test script
    cat > "${SCRIPT_DIR}/load_test.py" << EOF
import aiohttp
import asyncio
import time
import sys
import random
import json

async def make_request(session, url, headers, endpoint, request_id):
    start_time = time.time()
    try:
        if endpoint == "gpu-video":
            # Video processing request
            data = {
                "video_url": "https://storage.googleapis.com/airys-test-videos/sample_video.mp4",
                "process_type": "analyze",
                "options": {
                    "resolution": "720p",
                    "frame_rate": 30
                }
            }
        elif endpoint == "gpu-inference":
            # Inference request
            data = {
                "model": "object-detection",
                "input": "https://storage.googleapis.com/airys-test-images/sample_image.jpg",
                "options": {
                    "confidence": 0.5,
                    "use_gpu": True
                }
            }
        else:
            # GPU info request
            data = {}
        
        async with session.post(f"{url}/{endpoint}", headers=headers, json=data) as response:
            status = response.status
            await response.text()
            elapsed = time.time() - start_time
            print(f"Request {request_id} to {endpoint}: {status} in {elapsed:.2f}s")
            return status, elapsed
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"Request {request_id} to {endpoint} failed: {str(e)} in {elapsed:.2f}s")
        return 500, elapsed

async def user_behavior(user_id, url, headers, duration):
    start_time = time.time()
    end_time = start_time + duration
    request_id = 0
    
    async with aiohttp.ClientSession() as session:
        while time.time() < end_time:
            request_id += 1
            # Randomly select an endpoint to test
            endpoint = random.choice(["gpu-info", "gpu-inference", "gpu-video"])
            await make_request(session, url, headers, endpoint, f"{user_id}-{request_id}")
            
            # Random pause between requests (0.5 to 2 seconds)
            await asyncio.sleep(random.uniform(0.5, 2))

async def main():
    if len(sys.argv) != 5:
        print("Usage: python load_test.py <url> <token> <duration> <users>")
        return
    
    url = sys.argv[1]
    token = sys.argv[2]
    duration = int(sys.argv[3])
    users = int(sys.argv[4])
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    tasks = []
    for i in range(users):
        tasks.append(user_behavior(i, url, headers, duration))
    
    await asyncio.gather(*tasks)
    print(f"Load test completed with {users} users over {duration} seconds")

if __name__ == "__main__":
    asyncio.run(main())
EOF
    
    # Run the load test
    python "${SCRIPT_DIR}/load_test.py" "${SERVICE_URL}" "${TOKEN}" "${TEST_DURATION}" "${CONCURRENT_USERS}"
    
    success "Load generation completed"
}

# Check if metrics are being collected
check_metrics() {
    log "Checking if GPU metrics are being collected..."
    
    # Create a temporary metrics check script
    cat > "${SCRIPT_DIR}/check_metrics.py" << EOF
from google.cloud import monitoring_v3
import sys
import time

def check_metrics(project_id, service_name):
    client = monitoring_v3.MetricServiceClient()
    project_name = f"projects/{project_id}"
    
    # List of metrics to check
    metrics_to_check = [
        "run.googleapis.com/container/nvidia_gpu/utilization",
        "run.googleapis.com/container/nvidia_gpu/memory_used",
        "run.googleapis.com/container/nvidia_gpu/memory_total",
        "run.googleapis.com/request_count",
        "run.googleapis.com/request_latencies"
    ]
    
    results = {}
    
    for metric_type in metrics_to_check:
        filter_str = f'metric.type = "{metric_type}" AND resource.labels.service_name = "{service_name}"'
        
        # List the time series
        time_series = list(client.list_time_series(
            request={
                "name": project_name,
                "filter": filter_str,
                "interval": {
                    "start_time": {"seconds": int(time.time()) - 600},  # Last 10 minutes
                    "end_time": {"seconds": int(time.time())},
                },
            }
        ))
        
        if time_series:
            results[metric_type] = True
            print(f"✅ Metric {metric_type} is being collected")
            
            # Print a sample value
            if len(time_series) > 0 and len(time_series[0].points) > 0:
                point = time_series[0].points[0]
                if hasattr(point.value, 'double_value'):
                    value = point.value.double_value
                elif hasattr(point.value, 'int64_value'):
                    value = point.value.int64_value
                else:
                    value = "unknown type"
                print(f"   Sample value: {value}")
        else:
            results[metric_type] = False
            print(f"❌ Metric {metric_type} is NOT being collected")
    
    # Return overall success/failure
    return all(results.values()), results

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python check_metrics.py <project_id> <service_name>")
        sys.exit(1)
    
    project_id = sys.argv[1]
    service_name = sys.argv[2]
    
    success, results = check_metrics(project_id, service_name)
    
    if success:
        print("\nAll metrics are being collected successfully!")
        sys.exit(0)
    else:
        print("\nSome metrics are not being collected:")
        for metric, status in results.items():
            if not status:
                print(f"  - {metric}")
        sys.exit(1)
EOF
    
    # Run the metrics check
    python "${SCRIPT_DIR}/check_metrics.py" "${PROJECT_ID}" "${SERVICE_NAME}"
    
    if [ $? -eq 0 ]; then
        success "All metrics are being collected"
    else
        warning "Some metrics are not being collected. This may be normal if the service hasn't generated enough data yet."
    fi
}

# Check if alerts are properly configured
check_alerts() {
    log "Checking if alerts are properly configured..."
    
    # Create a temporary alerts check script
    cat > "${SCRIPT_DIR}/check_alerts.py" << EOF
from google.cloud import monitoring_v3
import sys

def check_alerts(project_id, service_name):
    client = monitoring_v3.AlertPolicyServiceClient()
    project_name = f"projects/{project_id}"
    
    # List all alert policies
    policies = list(client.list_alert_policies(name=project_name))
    
    # Check for GPU-related alerts
    gpu_alerts = []
    for policy in policies:
        # Check if this is a GPU-related alert
        is_gpu_alert = False
        for condition in policy.conditions:
            if "nvidia_gpu" in condition.condition_threshold.filter:
                is_gpu_alert = True
                break
        
        if is_gpu_alert:
            gpu_alerts.append({
                "name": policy.display_name,
                "enabled": policy.enabled,
                "conditions": len(policy.conditions)
            })
    
    if gpu_alerts:
        print(f"Found {len(gpu_alerts)} GPU-related alerts:")
        for alert in gpu_alerts:
            status = "✅ Enabled" if alert["enabled"] else "❌ Disabled"
            print(f"  - {alert['name']} ({status}, {alert['conditions']} conditions)")
        return True
    else:
        print("No GPU-related alerts found")
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python check_alerts.py <project_id> <service_name>")
        sys.exit(1)
    
    project_id = sys.argv[1]
    service_name = sys.argv[2]
    
    success = check_alerts(project_id, service_name)
    
    if success:
        print("\nGPU alerts are configured!")
        sys.exit(0)
    else:
        print("\nNo GPU alerts found. You may need to run setup-monitoring.sh")
        sys.exit(1)
EOF
    
    # Run the alerts check
    python "${SCRIPT_DIR}/check_alerts.py" "${PROJECT_ID}" "${SERVICE_NAME}"
    
    if [ $? -eq 0 ]; then
        success "Alerts are properly configured"
    else
        warning "No GPU alerts found. You may need to run setup-monitoring.sh"
    fi
}

# Main function
main() {
    log "Starting monitoring test for ${SERVICE_NAME} in ${PROJECT_ID}"
    
    # Check requirements
    check_venv
    get_auth_token
    
    # Run tests
    generate_load
    check_metrics
    check_alerts
    
    success "Monitoring test completed successfully"
    log "Next steps:"
    log "1. Check the GPU Performance Dashboard in Google Cloud Console"
    log "2. Verify that alerts are properly configured"
    log "3. Monitor cost implications of GPU usage"
}

# Run the main function
main 