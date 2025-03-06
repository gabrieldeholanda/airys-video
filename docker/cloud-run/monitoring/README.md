# GPU Monitoring for Airys Video

This directory contains scripts and configuration files for setting up and testing GPU monitoring for the Airys Video service running on Cloud Run with NVIDIA L4 GPUs.

## Overview

The monitoring setup includes:

- GPU-specific metrics collection
- Custom dashboards for visualizing GPU performance
- Alert policies for critical GPU metrics
- Budget alerts for cost management
- Testing tools to verify monitoring functionality

## Files

- `setup-monitoring.sh`: Script to set up all monitoring components
- `test-monitoring.sh`: Script to test the monitoring setup
- `gpu-performance-dashboard.json`: Configuration for the GPU performance dashboard
- `gpu-utilization-alert.json`: Configuration for the GPU utilization alert policy

## Setup Instructions

1. Ensure you have the necessary permissions:
   ```
   gcloud projects add-iam-policy-binding PROJECT_ID \
     --member="user:YOUR_EMAIL" \
     --role="roles/monitoring.admin"
   ```

2. Run the setup script:
   ```
   ./setup-monitoring.sh
   ```

3. Verify the setup with the test script:
   ```
   ./test-monitoring.sh
   ```

## Monitoring Components

### Metrics

The following GPU-specific metrics are collected:

- `run.googleapis.com/container/nvidia_gpu/utilization`: GPU utilization percentage
- `run.googleapis.com/container/nvidia_gpu/memory_used`: GPU memory used in bytes
- `run.googleapis.com/container/nvidia_gpu/memory_total`: Total GPU memory in bytes
- `run.googleapis.com/container/nvidia_gpu/power_usage`: GPU power usage in watts
- `run.googleapis.com/container/nvidia_gpu/temperature`: GPU temperature in Celsius

### Dashboards

The setup creates the following dashboards:

1. **GPU Performance Dashboard**: Visualizes GPU utilization, memory usage, power consumption, and temperature
2. **Service Performance Dashboard**: Tracks request latency, throughput, and error rates
3. **Cost Monitoring Dashboard**: Monitors GPU usage time and associated costs

### Alerts

The following alert policies are configured:

1. **GPU Utilization High**: Triggers when GPU utilization exceeds 90% for 15 minutes
2. **GPU Memory Near Capacity**: Triggers when GPU memory usage exceeds 85% for 10 minutes
3. **GPU Temperature High**: Triggers when GPU temperature exceeds 80°C for 5 minutes
4. **GPU Throttling Detected**: Triggers when throttling events are detected
5. **High GPU Endpoint Latency**: Triggers when endpoint latency exceeds thresholds
6. **GPU Endpoint Errors**: Triggers when error rate exceeds 1% for 5 minutes
7. **No GPU Detected**: Triggers when GPU is not detected in the container

### Budget Alerts

Budget alerts are configured to notify when:

1. **GPU Cost Threshold Approaching**: 80% of monthly budget is reached
2. **GPU Cost Threshold Exceeded**: 100% of monthly budget is exceeded

## Testing

The `test-monitoring.sh` script performs the following tests:

1. Generates load on the GPU service to produce metrics
2. Verifies that metrics are being collected
3. Checks that alert policies are properly configured

## Troubleshooting

If metrics are not being collected:

1. Verify that the Cloud Run service is running with GPU enabled
2. Check that the service has processed requests recently
3. Ensure the monitoring API is enabled: `gcloud services enable monitoring.googleapis.com`
4. Verify IAM permissions for the monitoring service account

If alerts are not triggering:

1. Check that notification channels are properly configured
2. Verify that alert conditions match the expected metrics
3. Ensure that the alert policies are enabled

## References

- [Cloud Run GPU Documentation](https://cloud.google.com/run/docs/using-gpus)
- [Cloud Monitoring Documentation](https://cloud.google.com/monitoring/docs)
- [NVIDIA GPU Metrics](https://docs.nvidia.com/datacenter/cloud-native/gpu-telemetry/dcgm-exporter.html)
- [Cloud Run Monitoring](https://cloud.google.com/run/docs/monitoring)
- [Budget Alerts](https://cloud.google.com/billing/docs/how-to/budgets)

## Related Documentation

- [GPU Implementation Status](/docs/Deploy/GPU-Implementation-Status.md)
- [GPU Monitoring Setup](/docs/Deploy/GPU-Monitoring-Setup.md)
- [GPU Performance Report](/docs/Deploy/GPU-Performance-Report.md) 