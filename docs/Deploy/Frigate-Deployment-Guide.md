# Frigate Deployment Guide for Cloud Run with GPU

## Overview

This guide details the process of deploying the Airys Video platform, a Frigate-based video surveillance system, on Google Cloud Run with GPU acceleration.

## Prerequisites

1. **Google Cloud Project Setup**
   ```bash
   # Set project ID
   export PROJECT_ID="airys-production"
   gcloud config set project $PROJECT_ID
   
   # Enable required APIs
   gcloud services enable run.googleapis.com \
                        compute.googleapis.com \
                        cloudbuild.googleapis.com \
                        storage.googleapis.com \
                        monitoring.googleapis.com \
                        firebase.googleapis.com
   ```

2. **GPU Quota**
   - Request L4 GPU quota in us-central1
   - Minimum requirement: 4 GPUs
   - Navigate to: IAM & Admin > Quotas

3. **Firebase Setup**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools
   
   # Initialize Firebase
   firebase init
   ```

## Configuration

### 1. Frigate Configuration

Create a secret for Frigate configuration:
```bash
# Create config.yml
cat > config.yml << EOF
mqtt:
  enabled: false

cameras:
  camera1:
    ffmpeg:
      inputs:
        - path: rtsp://camera1_ip:554/stream
          roles:
            - detect
            - record
    detect:
      enabled: true
      width: 1280
      height: 720
      fps: 10
    record:
      enabled: true
      retain_days: 7
      events:
        retain_days: 30
        objects:
          - person
          - vehicle

storage:
  path: /media/frigate
EOF

# Create secret
gcloud secrets create frigate-config \
    --replication-policy="automatic" \
    --data-file="config.yml"
```

### 2. Cloud Storage Setup

```bash
# Create buckets
gsutil mb -l us-central1 gs://airys-video-storage
gsutil mb -l us-central1 gs://airys-video-events

# Set lifecycle policies
cat > lifecycle.json << EOF
{
  "rule": [
    {
      "action": {"type": "Delete"},
      "condition": {
        "age": 7,
        "matchesPrefix": ["recordings/"]
      }
    },
    {
      "action": {"type": "Delete"},
      "condition": {
        "age": 30,
        "matchesPrefix": ["events/"]
      }
    }
  ]
}
EOF

gsutil lifecycle set lifecycle.json gs://airys-video-storage
```

### 3. Service Account Setup

```bash
# Create service account
gcloud iam service-accounts create airys-cloud-run \
    --display-name="Airys Cloud Run Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:airys-cloud-run@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:airys-cloud-run@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectCreator"
```

## Deployment

### 1. Build and Push Docker Image

```bash
# Build the image
gcloud builds submit \
    --config=cloudbuild.yaml \
    --substitutions=_REGION="us-central1"

# Or build locally and push
docker build -t gcr.io/$PROJECT_ID/airys-video:latest .
docker push gcr.io/$PROJECT_ID/airys-video:latest
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy airys-video \
    --image gcr.io/$PROJECT_ID/airys-video:latest \
    --region us-central1 \
    --platform managed \
    --memory 16Gi \
    --cpu 8 \
    --timeout 3600 \
    --service-account airys-cloud-run@$PROJECT_ID.iam.gserviceaccount.com \
    --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
    --set-env-vars="GOOGLE_CLOUD_STORAGE_BUCKET=airys-video-storage" \
    --set-env-vars="NVIDIA_VISIBLE_DEVICES=all" \
    --set-env-vars="NVIDIA_DRIVER_CAPABILITIES=compute,video,utility" \
    --set-env-vars="CUDA_VISIBLE_DEVICES=0" \
    --update-secrets="FRIGATE_RTSP_PASSWORD=frigate-rtsp-password:1" \
    --annotation run.googleapis.com/launch-stage=BETA \
    --annotation run.googleapis.com/accelerator=L4
```

### 3. Configure Monitoring

```bash
# Set up monitoring
./docker/cloud-run/monitoring/setup-monitoring.sh

# Verify monitoring
./docker/cloud-run/monitoring/test-monitoring.sh
```

## Verification

### 1. Check Service Status

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe airys-video \
    --region us-central1 \
    --format='value(status.url)')

# Test GPU availability
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
    $SERVICE_URL/api/gpu/info
```

### 2. Verify Frigate Integration

```bash
# Check Frigate version
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
    $SERVICE_URL/api/version

# Test camera connection
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
    $SERVICE_URL/api/test/camera
```

## Scaling and Performance

### 1. Scaling Configuration

```yaml
# Scaling configuration in cloud-run-config.yaml
metadata:
  annotations:
    autoscaling.knative.dev/maxScale: "3"  # Maximum instances with GPU
    autoscaling.knative.dev/minScale: "1"  # Minimum instances
```

### 2. Performance Monitoring

Monitor the following metrics in Cloud Console:
- Object Detection Rate
- Frame Processing Rate
- GPU Utilization
- Memory Usage
- Event Detection Rate

## Troubleshooting

### Common Issues

1. **GPU Not Detected**
   ```bash
   # Check GPU status
   curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
       $SERVICE_URL/api/gpu/info
   ```

2. **RTSP Stream Issues**
   - Verify network connectivity
   - Check RTSP password configuration
   - Inspect service logs

3. **Storage Issues**
   ```bash
   # Check storage access
   curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
       $SERVICE_URL/api/test/storage
   ```

### Logging

```bash
# View service logs
gcloud logging read "resource.type=cloud_run_revision AND \
    resource.labels.service_name=airys-video" --limit 50

# Stream logs
gcloud logging tail "resource.type=cloud_run_revision AND \
    resource.labels.service_name=airys-video"
```

## Maintenance

### 1. Updates and Upgrades

```bash
# Update Frigate configuration
gcloud secrets versions add frigate-config --data-file="config.yml"

# Deploy new version
gcloud run deploy airys-video \
    --image gcr.io/$PROJECT_ID/airys-video:new-version \
    [... other flags ...]
```

### 2. Backup and Recovery

```bash
# Backup configuration
gcloud secrets versions list frigate-config
gcloud secrets versions access latest --secret="frigate-config" > backup_config.yml

# Backup events data
gsutil -m cp -r gs://airys-video-events gs://airys-backup/events-$(date +%Y%m%d)
```

## References

- [Frigate Documentation](https://docs.frigate.video)
- [Cloud Run GPU Guide](https://cloud.google.com/run/docs/using-gpus)
- [GPU Implementation Status](./GPU-Implementation-Status.md)
- [GPU Performance Report](./GPU-Performance-Report.md)
- [GPU Monitoring Setup](./GPU-Monitoring-Setup.md) 