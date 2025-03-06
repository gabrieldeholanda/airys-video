#!/bin/bash
set -e

# Configuration
SERVICE_NAME="airys-video"
PROJECT_ID="airys-production"
REGION="us-central1"
RESULTS_DIR="test_results"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

# Setup test environment
setup_test_env() {
    log "Setting up test environment..."
    
    # Create results directory
    mkdir -p "${RESULTS_DIR}"
    
    # Ensure virtual environment is activated
    if [[ -z "${VIRTUAL_ENV}" ]]; then
        if [[ -d "venv" ]]; then
            info "Activating virtual environment"
            source venv/bin/activate
        else
            info "Creating virtual environment"
            python3 -m venv venv
            source venv/bin/activate
            pip install aiohttp
        fi
    fi
    
    # Get service URL
    SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
        --region=$REGION \
        --format='value(status.url)')
    
    # Get authentication token
    AUTH_TOKEN=$(gcloud auth print-identity-token)
    
    # Export for use in performance_test.py
    export SERVICE_URL
    export AUTH_TOKEN
    
    success "Test environment setup completed"
}

# Run performance tests
run_performance_tests() {
    local skip_gpu=$1
    log "Running performance tests..."
    
    TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    RESULTS_FILE="${RESULTS_DIR}/performance_test_${TIMESTAMP}.json"
    
    if [ "$skip_gpu" = true ]; then
        info "Skipping GPU-specific tests"
        python3 performance_test.py \
            --service-url "${SERVICE_URL}" \
            --auth-token "${AUTH_TOKEN}" \
            --output "${RESULTS_FILE}" \
            --skip-gpu >&2
    else
        info "Including GPU-specific tests"
        python3 performance_test.py \
            --service-url "${SERVICE_URL}" \
            --auth-token "${AUTH_TOKEN}" \
            --output "${RESULTS_FILE}" >&2
    fi
    
    success "Performance tests completed. Results saved to ${RESULTS_FILE}"
    printf "%s" "${RESULTS_FILE}"
}

# Analyze test results
analyze_results() {
    local results_file=$1
    log "Analyzing test results from ${results_file}"
    
    if [ ! -f "${results_file}" ]; then
        error "Results file not found: ${results_file}"
    fi
    
    # Extract and format key metrics
    python3 - <<EOF
import json
import statistics
from datetime import datetime

def format_duration(ms):
    if ms < 1:
        return f"{ms*1000:.2f}μs"
    elif ms < 1000:
        return f"{ms:.2f}ms"
    else:
        return f"{ms/1000:.2f}s"

try:
    with open('${results_file}') as f:
        data = json.load(f)

    print("\nTest Summary")
    print("============")
    print(f"Test Time: {datetime.fromisoformat(data['timestamp']).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    print(f"Service: {data['service_url']}")
    
    # Print hardware info if available
    if 'hardware_info' in data and 'device_info' in data['hardware_info']:
        device = data['hardware_info']['device_info']
        print("\nHardware Information")
        print("===================")
        print(f"Device Type: {device.get('type', 'unknown')}")
        print(f"Device Name: {device.get('name', 'unknown')}")
        print(f"Device Count: {device.get('count', 0)}")
        print(f"Available: {'Yes' if device.get('available', False) else 'No'}")

    print("\nEndpoint Performance")
    print("===================")
    
    # Group tests by endpoint type
    cpu_tests = {}
    gpu_tests = {}
    
    for test_name, results in data['tests'].items():
        if test_name.startswith('gpu_'):
            gpu_tests[test_name] = results
        else:
            cpu_tests[test_name] = results
    
    # Print CPU endpoint results
    print("\nStandard Endpoints:")
    for test_name, results in cpu_tests.items():
        if test_name.endswith('_latency'):
            endpoint = test_name.replace('_latency', '')
            print(f"\n  {endpoint.upper()} Endpoint Latency:")
            print(f"    Min: {format_duration(results['min'])}")
            print(f"    Max: {format_duration(results['max'])}")
            print(f"    Avg: {format_duration(results['avg'])}")
            print(f"    P95: {format_duration(results['p95'])}")
            print(f"    P99: {format_duration(results['p99'])}")
            if 'error_rate' in results:
                print(f"    Error Rate: {results['error_rate']*100:.2f}%")
        elif test_name.endswith('_load'):
            endpoint = test_name.replace('_load', '')
            print(f"\n  {endpoint.upper()} Load Test Results:")
            print(f"    Requests/sec: {results['requests_per_second']:.2f}")
            print(f"    Error Rate: {results['error_rate']*100:.2f}%")
            print(f"    Concurrent Users: {results['concurrent_users']}")
            print(f"    P95 Latency: {format_duration(results['latency_stats']['p95'])}")
    
    # Print GPU endpoint results if available
    if gpu_tests:
        print("\nGPU-Accelerated Endpoints:")
        for test_name, results in gpu_tests.items():
            if test_name.endswith('_latency'):
                endpoint = test_name.replace('_latency', '')
                print(f"\n  {endpoint.upper()} Endpoint Latency:")
                print(f"    Min: {format_duration(results['min'])}")
                print(f"    Max: {format_duration(results['max'])}")
                print(f"    Avg: {format_duration(results['avg'])}")
                print(f"    P95: {format_duration(results['p95'])}")
                print(f"    P99: {format_duration(results['p99'])}")
                if 'error_rate' in results:
                    print(f"    Error Rate: {results['error_rate']*100:.2f}%")
            elif test_name.endswith('_load'):
                endpoint = test_name.replace('_load', '')
                print(f"\n  {endpoint.upper()} Load Test Results:")
                print(f"    Requests/sec: {results['requests_per_second']:.2f}")
                print(f"    Error Rate: {results['error_rate']*100:.2f}%")
                print(f"    Concurrent Users: {results['concurrent_users']}")
                print(f"    P95 Latency: {format_duration(results['latency_stats']['p95'])}")

    # Print GPU metrics if available
    if 'gpu_metrics' in data and data['gpu_metrics']:
        print("\nGPU Metrics")
        print("===========")
        for metric in data['gpu_metrics']:
            if 'metric' in metric:
                print(f"\n{metric['metric']['type']}:")
                if 'points' in metric:
                    values = [point['value']['doubleValue'] for point in metric['points']]
                    print(f"  Average: {statistics.mean(values):.2f}")
                    print(f"  Max: {max(values):.2f}")
    
    print("\nResource Utilization")
    print("===================")
    metrics = data.get('resource_metrics', {})
    for metric in metrics:
        if 'metric' in metric:
            print(f"\n{metric['metric']['type']}:")
            if 'points' in metric:
                values = [point['value']['doubleValue'] for point in metric['points']]
                print(f"  Average: {statistics.mean(values):.2f}")
                print(f"  Max: {max(values):.2f}")
except Exception as e:
    print(f"Error analyzing results: {str(e)}")
EOF
}

# Compare with previous results
compare_results() {
    local current_file=$1
    local baseline_file=$2
    
    if [ ! -f "${current_file}" ] || [ ! -f "${baseline_file}" ]; then
        error "Results files not found for comparison"
    fi
    
    log "Comparing current results with baseline..."
    
    python3 - <<EOF
import json
import statistics

def format_duration(ms):
    if ms < 1:
        return f"{ms*1000:.2f}μs"
    elif ms < 1000:
        return f"{ms:.2f}ms"
    else:
        return f"{ms/1000:.2f}s"

def format_change(old, new):
    if old == 0:
        return "N/A"
    change = ((new - old) / old) * 100
    return f"{change:.2f}%"

def format_improvement(old, new, lower_is_better=True):
    if old == 0:
        return ""
    change = ((new - old) / old) * 100
    is_improvement = (change < 0) if lower_is_better else (change > 0)
    
    if is_improvement:
        return f"${GREEN}▼ {abs(change):.2f}%${NC}"
    else:
        return f"${RED}▲ {abs(change):.2f}%${NC}"

try:
    with open('${current_file}') as f:
        current = json.load(f)
    
    with open('${baseline_file}') as f:
        baseline = json.load(f)
    
    print("\nPerformance Comparison")
    print("=====================")
    print(f"Baseline: {baseline['timestamp']}")
    print(f"Current:  {current['timestamp']}")
    
    # Compare hardware info
    if 'hardware_info' in current and 'hardware_info' in baseline:
        current_hw = current.get('hardware_info', {}).get('device_info', {})
        baseline_hw = baseline.get('hardware_info', {}).get('device_info', {})
        
        print("\nHardware Comparison")
        print("===================")
        print(f"Baseline: {baseline_hw.get('type', 'unknown')} - {baseline_hw.get('name', 'unknown')}")
        print(f"Current:  {current_hw.get('type', 'unknown')} - {current_hw.get('name', 'unknown')}")
    
    # Compare endpoint performance
    print("\nLatency Comparison (Average)")
    print("===========================")
    print(f"{'Endpoint':<20} {'Baseline':<15} {'Current':<15} {'Change':<15}")
    print(f"{'-'*20} {'-'*15} {'-'*15} {'-'*15}")
    
    # Compare latency tests
    for test_name in sorted(current['tests'].keys()):
        if test_name.endswith('_latency') and test_name in baseline['tests']:
            endpoint = test_name.replace('_latency', '')
            baseline_avg = baseline['tests'][test_name]['avg']
            current_avg = current['tests'][test_name]['avg']
            
            print(f"{endpoint:<20} {format_duration(baseline_avg):<15} {format_duration(current_avg):<15} {format_improvement(baseline_avg, current_avg)}")
    
    # Compare throughput
    print("\nThroughput Comparison (Requests/sec)")
    print("===================================")
    print(f"{'Endpoint':<20} {'Baseline':<15} {'Current':<15} {'Change':<15}")
    print(f"{'-'*20} {'-'*15} {'-'*15} {'-'*15}")
    
    for test_name in sorted(current['tests'].keys()):
        if test_name.endswith('_load') and test_name in baseline['tests']:
            endpoint = test_name.replace('_load', '')
            baseline_rps = baseline['tests'][test_name]['requests_per_second']
            current_rps = current['tests'][test_name]['requests_per_second']
            
            print(f"{endpoint:<20} {baseline_rps:.2f}/s{' '*8} {current_rps:.2f}/s{' '*8} {format_improvement(baseline_rps, current_rps, False)}")
    
    # Compare P95 latency
    print("\nP95 Latency Comparison")
    print("=====================")
    print(f"{'Endpoint':<20} {'Baseline':<15} {'Current':<15} {'Change':<15}")
    print(f"{'-'*20} {'-'*15} {'-'*15} {'-'*15}")
    
    for test_name in sorted(current['tests'].keys()):
        if test_name.endswith('_latency') and test_name in baseline['tests']:
            endpoint = test_name.replace('_latency', '')
            baseline_p95 = baseline['tests'][test_name]['p95']
            current_p95 = current['tests'][test_name]['p95']
            
            print(f"{endpoint:<20} {format_duration(baseline_p95):<15} {format_duration(current_p95):<15} {format_improvement(baseline_p95, current_p95)}")
    
except Exception as e:
    print(f"Error comparing results: {str(e)}")
EOF
}

# Find the most recent CPU baseline test
find_baseline() {
    local pattern="performance_test_*.json"
    local baseline=$(find "${RESULTS_DIR}" -name "${pattern}" -type f | sort | grep -v "gpu" | tail -n 1)
    
    if [ -z "$baseline" ]; then
        log "No baseline found. Using current test as baseline."
        return 1
    fi
    
    echo "$baseline"
    return 0
}

# Main execution
main() {
    log "Starting performance test suite for $SERVICE_NAME"
    
    setup_test_env
    
    # Run tests with GPU support
    results_file=$(run_performance_tests false)
    analyze_results "${results_file}"
    
    # Find baseline for comparison
    baseline=$(find_baseline)
    if [ $? -eq 0 ]; then
        log "Found baseline: $baseline"
        compare_results "${results_file}" "${baseline}"
    fi
    
    success "Performance test suite completed"
    echo -e "\nDetailed results available in: ${results_file}"
}

# Execute main if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi 