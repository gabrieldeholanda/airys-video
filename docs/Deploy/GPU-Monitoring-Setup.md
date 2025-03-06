# GPU Monitoring Setup

## Overview
This document outlines the monitoring configuration for the L4 GPU-accelerated Cloud Run service. The monitoring setup includes GPU-specific metrics, dashboards, alerts, and cost tracking.

## Monitoring Requirements

### GPU-Specific Metrics
```yaml
Required Metrics:
  - GPU Utilization:
    Description: Percentage of GPU compute capacity used
    Metric Type: run.googleapis.com/container/nvidia_gpu/utilization
    Aggregation: Mean, Max
    Frequency: 1 minute
    
  - GPU Memory Usage:
    Description: Amount of GPU memory used by the container
    Metric Type: run.googleapis.com/container/nvidia_gpu/memory_used
    Aggregation: Mean, Max
    Frequency: 1 minute
    
  - GPU Memory Total:
    Description: Total GPU memory available
    Metric Type: run.googleapis.com/container/nvidia_gpu/memory_total
    Aggregation: Mean
    Frequency: 1 minute
    
  - GPU Power Usage:
    Description: Power consumption of the GPU
    Metric Type: run.googleapis.com/container/nvidia_gpu/power_usage
    Aggregation: Mean, Max
    Frequency: 1 minute
    
  - GPU Temperature:
    Description: Temperature of the GPU
    Metric Type: run.googleapis.com/container/nvidia_gpu/temperature
    Aggregation: Mean, Max
    Frequency: 1 minute
    
  - GPU Throttling Events:
    Description: Number of throttling events
    Metric Type: run.googleapis.com/container/nvidia_gpu/throttling_events
    Aggregation: Count
    Frequency: 1 minute
```

### Service Performance Metrics
```yaml
Required Metrics:
  - Request Latency:
    Description: Latency of requests to GPU-accelerated endpoints
    Metric Type: run.googleapis.com/request_latencies
    Filter: service_name="airys-video" AND path=~"/api/gpu.*"
    Aggregation: Mean, P95, P99
    Frequency: 1 minute
    
  - Request Count:
    Description: Number of requests to GPU-accelerated endpoints
    Metric Type: run.googleapis.com/request_count
    Filter: service_name="airys-video" AND path=~"/api/gpu.*"
    Aggregation: Count, Rate
    Frequency: 1 minute
    
  - Error Rate:
    Description: Error rate for GPU-accelerated endpoints
    Metric Type: run.googleapis.com/request_count
    Filter: service_name="airys-video" AND path=~"/api/gpu.*" AND status_code>=400
    Aggregation: Count, Rate
    Frequency: 1 minute
    
  - Container Instance Count:
    Description: Number of container instances
    Metric Type: run.googleapis.com/container/instance_count
    Filter: service_name="airys-video"
    Aggregation: Sum
    Frequency: 1 minute
    
  - Container CPU Utilization:
    Description: CPU utilization of the container
    Metric Type: run.googleapis.com/container/cpu/utilization
    Filter: service_name="airys-video"
    Aggregation: Mean, Max
    Frequency: 1 minute
    
  - Container Memory Utilization:
    Description: Memory utilization of the container
    Metric Type: run.googleapis.com/container/memory/utilization
    Filter: service_name="airys-video"
    Aggregation: Mean, Max
    Frequency: 1 minute
```

### Cost Metrics
```yaml
Required Metrics:
  - GPU Usage Time:
    Description: Total time GPU is allocated
    Metric Type: run.googleapis.com/container/billable_instance_time
    Filter: service_name="airys-video" AND resource_name="nvidia.com/gpu"
    Aggregation: Sum
    Frequency: 1 hour
    
  - Total Billable Time:
    Description: Total billable time for the service
    Metric Type: run.googleapis.com/billable_instance_time
    Filter: service_name="airys-video"
    Aggregation: Sum
    Frequency: 1 hour
```

## Dashboard Configuration

### GPU Performance Dashboard
```yaml
Dashboard Name: "Airys Video - GPU Performance"
Refresh Rate: 1 minute
Time Range: Last 24 hours (adjustable)

Panels:
  - GPU Utilization:
    Type: Line Chart
    Metrics: run.googleapis.com/container/nvidia_gpu/utilization
    Aggregation: Mean
    Filter: service_name="airys-video"
    
  - GPU Memory Usage:
    Type: Line Chart
    Metrics: 
      - run.googleapis.com/container/nvidia_gpu/memory_used
      - run.googleapis.com/container/nvidia_gpu/memory_total
    Aggregation: Mean
    Filter: service_name="airys-video"
    
  - GPU Power Usage:
    Type: Line Chart
    Metrics: run.googleapis.com/container/nvidia_gpu/power_usage
    Aggregation: Mean
    Filter: service_name="airys-video"
    
  - GPU Temperature:
    Type: Line Chart
    Metrics: run.googleapis.com/container/nvidia_gpu/temperature
    Aggregation: Mean
    Filter: service_name="airys-video"
    
  - GPU Throttling Events:
    Type: Bar Chart
    Metrics: run.googleapis.com/container/nvidia_gpu/throttling_events
    Aggregation: Count
    Filter: service_name="airys-video"
```

### Service Performance Dashboard
```yaml
Dashboard Name: "Airys Video - Service Performance"
Refresh Rate: 1 minute
Time Range: Last 24 hours (adjustable)

Panels:
  - Request Latency:
    Type: Line Chart
    Metrics: run.googleapis.com/request_latencies
    Aggregation: Mean, P95, P99
    Filter: service_name="airys-video" AND path=~"/api/gpu.*"
    
  - Request Count:
    Type: Line Chart
    Metrics: run.googleapis.com/request_count
    Aggregation: Rate
    Filter: service_name="airys-video" AND path=~"/api/gpu.*"
    
  - Error Rate:
    Type: Line Chart
    Metrics: 
      - run.googleapis.com/request_count (errors)
      - run.googleapis.com/request_count (total)
    Aggregation: Rate
    Filter: 
      - service_name="airys-video" AND path=~"/api/gpu.*" AND status_code>=400
      - service_name="airys-video" AND path=~"/api/gpu.*"
    
  - Container Instance Count:
    Type: Line Chart
    Metrics: run.googleapis.com/container/instance_count
    Aggregation: Sum
    Filter: service_name="airys-video"
    
  - CPU vs GPU Utilization:
    Type: Line Chart
    Metrics: 
      - run.googleapis.com/container/cpu/utilization
      - run.googleapis.com/container/nvidia_gpu/utilization
    Aggregation: Mean
    Filter: service_name="airys-video"
```

### Cost Dashboard
```yaml
Dashboard Name: "Airys Video - Cost Monitoring"
Refresh Rate: 1 hour
Time Range: Last 30 days (adjustable)

Panels:
  - GPU Usage Time:
    Type: Line Chart
    Metrics: run.googleapis.com/container/billable_instance_time
    Aggregation: Sum
    Filter: service_name="airys-video" AND resource_name="nvidia.com/gpu"
    
  - Total Billable Time:
    Type: Line Chart
    Metrics: run.googleapis.com/billable_instance_time
    Aggregation: Sum
    Filter: service_name="airys-video"
    
  - Estimated GPU Cost:
    Type: Gauge
    Metrics: run.googleapis.com/container/billable_instance_time
    Aggregation: Sum
    Filter: service_name="airys-video" AND resource_name="nvidia.com/gpu"
    Transformation: Multiply by hourly GPU cost rate
    
  - Estimated Total Cost:
    Type: Gauge
    Metrics: run.googleapis.com/billable_instance_time
    Aggregation: Sum
    Filter: service_name="airys-video"
    Transformation: Multiply by hourly service cost rate
```

## Alert Configuration

### GPU Performance Alerts
```yaml
Alert Name: "GPU Utilization High"
Description: "GPU utilization is consistently high, indicating potential performance bottlenecks"
Metric: run.googleapis.com/container/nvidia_gpu/utilization
Condition: Mean > 90% for 15 minutes
Severity: Warning
Notification Channels: Email, Slack

Alert Name: "GPU Memory Near Capacity"
Description: "GPU memory usage is approaching capacity"
Metric: run.googleapis.com/container/nvidia_gpu/memory_used / run.googleapis.com/container/nvidia_gpu/memory_total
Condition: Mean > 85% for 10 minutes
Severity: Warning
Notification Channels: Email, Slack

Alert Name: "GPU Temperature High"
Description: "GPU temperature is abnormally high"
Metric: run.googleapis.com/container/nvidia_gpu/temperature
Condition: Mean > 80°C for 5 minutes
Severity: Critical
Notification Channels: Email, Slack, PagerDuty

Alert Name: "GPU Throttling Detected"
Description: "GPU throttling events detected, indicating performance degradation"
Metric: run.googleapis.com/container/nvidia_gpu/throttling_events
Condition: Count > 0 for 5 minutes
Severity: Warning
Notification Channels: Email, Slack
```

### Service Performance Alerts
```yaml
Alert Name: "High GPU Endpoint Latency"
Description: "GPU-accelerated endpoints are experiencing high latency"
Metric: run.googleapis.com/request_latencies
Filter: service_name="airys-video" AND path=~"/api/gpu.*"
Condition: P95 > 1000ms for 10 minutes
Severity: Warning
Notification Channels: Email, Slack

Alert Name: "GPU Endpoint Errors"
Description: "GPU-accelerated endpoints are returning errors"
Metric: run.googleapis.com/request_count
Filter: service_name="airys-video" AND path=~"/api/gpu.*" AND status_code>=500
Condition: Count > 5 for 5 minutes
Severity: Critical
Notification Channels: Email, Slack, PagerDuty

Alert Name: "No GPU Detected"
Description: "Service is running but GPU is not detected or not available"
Metric: run.googleapis.com/container/nvidia_gpu/utilization
Condition: Count is absent for 5 minutes
Severity: Critical
Notification Channels: Email, Slack, PagerDuty
```

### Cost Alerts
```yaml
Alert Name: "GPU Cost Threshold Approaching"
Description: "Monthly GPU cost is approaching the budget threshold"
Metric: run.googleapis.com/container/billable_instance_time
Filter: service_name="airys-video" AND resource_name="nvidia.com/gpu"
Condition: Sum * hourly_rate > monthly_budget * 0.8 for current month
Severity: Warning
Notification Channels: Email, Slack

Alert Name: "GPU Cost Threshold Exceeded"
Description: "Monthly GPU cost has exceeded the budget threshold"
Metric: run.googleapis.com/container/billable_instance_time
Filter: service_name="airys-video" AND resource_name="nvidia.com/gpu"
Condition: Sum * hourly_rate > monthly_budget for current month
Severity: Critical
Notification Channels: Email, Slack, Finance Team
```

## Implementation Steps

1. **Enable Required Metrics**
   ```bash
   gcloud services enable monitoring.googleapis.com
   gcloud services enable cloudmonitoring.googleapis.com
   ```

2. **Create Custom Metrics (if needed)**
   ```bash
   # Example for creating a custom metric for GPU efficiency
   gcloud beta monitoring metrics-scopes create \
     --project=airys-production \
     --monitoring-project=airys-production
   ```

3. **Set Up Dashboards**
   ```bash
   # Create dashboards using Monitoring API or Console
   gcloud monitoring dashboards create \
     --config-from-file=gpu-performance-dashboard.json
   ```

4. **Configure Alerts**
   ```bash
   # Create alert policies
   gcloud alpha monitoring policies create \
     --policy-from-file=gpu-utilization-alert.json
   ```

5. **Set Up Notification Channels**
   ```bash
   # Create email notification channel
   gcloud alpha monitoring channels create \
     --display-name="GPU Alerts Email" \
     --type=email \
     --channel-content="email-addresses=alerts@airys.com"
   
   # Create Slack notification channel
   gcloud alpha monitoring channels create \
     --display-name="GPU Alerts Slack" \
     --type=slack \
     --channel-content="auth-token=TOKEN,channel-name=#gpu-alerts"
   ```

6. **Configure Budget Alerts**
   ```bash
   # Create budget alert
   gcloud billing budgets create \
     --billing-account=BILLING_ACCOUNT_ID \
     --display-name="GPU Budget" \
     --budget-amount=1000USD \
     --threshold-rule=percent=80 \
     --threshold-rule=percent=100 \
     --email=finance@airys.com
   ```

## Monitoring Best Practices

1. **Regular Review**: Schedule weekly reviews of GPU performance metrics to identify optimization opportunities.

2. **Baseline Comparison**: Compare current metrics with established baselines to detect anomalies.

3. **Cost Optimization**: Use monitoring data to identify idle periods and implement auto-scaling policies.

4. **Alert Tuning**: Regularly review and adjust alert thresholds based on actual usage patterns.

5. **Dashboard Sharing**: Share dashboards with relevant teams to improve collaboration.

6. **Historical Analysis**: Retain historical data for trend analysis and capacity planning.

7. **Correlation Analysis**: Correlate GPU metrics with application performance to identify bottlenecks.

## Next Steps

1. **Implement Monitoring**: Set up the monitoring configuration as defined in this document.

2. **Validate Alerts**: Test alert conditions to ensure proper notification.

3. **Document Runbooks**: Create runbooks for responding to different alert conditions.

4. **Train Team**: Ensure the operations team understands how to interpret GPU metrics.

5. **Refine Thresholds**: Adjust alert thresholds based on initial monitoring data.

6. **Automate Responses**: Implement automated responses to common alert conditions.

7. **Integrate with Existing Monitoring**: Ensure GPU monitoring integrates with existing monitoring systems. 