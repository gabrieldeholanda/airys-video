# Deployment Guide for Airys Video Platform on Google Cloud

## Overview

This guide details the process of deploying the Airys Video platform, a Frigate-based video surveillance system, on Google Cloud Run with GPU acceleration. It includes best practices and progress tracking for each step.

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
   - Request L4 GPU quota in `us-central1`.
   - Minimum requirement: 4 GPUs.
   - Navigate to: IAM & Admin > Quotas.

3. **Firebase Setup**
   ```bash
   # Install Firebase CLI
   npm install -g firebase-tools

   # Initialize Firebase
   firebase init
   ```

## Step-by-Step Deployment Process

### Step 1: Infrastructure Setup

The following infrastructure has been successfully set up:

1. **Google Cloud Storage Buckets**:
   - **Bucket for Video Storage**: `airys-video-storage` (already exists)
   - **Bucket for Events**: `airys-video-events` (already exists)

2. **Cloud SQL Instance**:
   - **Instance ID**: `airys-video-instance`
   - **Database Version**: MySQL 8.0
   - **Location**: `us-central1-c`
   - **Tier**: `db-n1-standard-1`
   - **Status**: RUNNABLE

This step is now complete. Proceed to the next step in the deployment guide.

### Step 2: Frigate Configuration

The Frigate configuration has been successfully set up with the following details:

1. **Frigate Configuration File**: The `config.yml` file has been created with the default settings:
   ```yaml
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
   ```

2. **Secret for Frigate Configuration**: The existing secret `frigate-config` has been updated with the new configuration file.

This step is now complete. Proceed to the next step in the deployment guide.

### Step 3: Build and Deploy Docker Images

1. **Create Dockerfile for Backend**
   ```dockerfile
   FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9
   WORKDIR /app
   COPY ./app /app
   RUN pip install -r requirements.txt
   ```

2. **Build Docker Images**
   ```yaml
   # cloudbuild.yaml
   steps:
   - name: 'gcr.io/cloud-builders/docker'
     args: ['build', '-t', 'gcr.io/$PROJECT_ID/airys-video:latest', '.']
   ```

   Run the build:
   ```bash
   gcloud builds submit --config cloudbuild.yaml
   ```

### Step 4: Deploy to Cloud Run

1. **Deploy Backend Service**
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

### Step 5: Deploy Frontend

1. **Build the Frontend Application**
   - Navigate to the frontend directory and build the application:
   ```bash
   cd web
   npm run build
   ```

2. **Upload Built Frontend Files to Google Cloud Storage**
   ```bash
   gsutil -m rsync -r build/ gs://your-frontend-bucket
   ```

3. **Configure the Bucket for Static Website Hosting**
   ```bash
   gsutil web set -m index.html gs://your-frontend-bucket
   ```

### Step 6: Configure Monitoring and Logging

1. **Set Up Monitoring**
   ```bash
   # Set up monitoring
   ./docker/cloud-run/monitoring/setup-monitoring.sh
   ```

2. **Verify Monitoring**
   ```bash
   # Verify monitoring
   ./docker/cloud-run/monitoring/test-monitoring.sh
   ```

### Step 7: Verification

1. **Check Service Status**
   ```bash
   # Get service URL
   SERVICE_URL=$(gcloud run services describe airys-video \
       --region us-central1 \
       --format='value(status.url)')

   # Test GPU availability
   curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
       $SERVICE_URL/api/gpu/info
   ```

2. **Verify Frigate Integration**
   ```bash
   # Check Frigate version
   curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
       $SERVICE_URL/api/version

   # Test camera connection
   curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
       $SERVICE_URL/api/test/camera
   ```

## Progress Tracking

- **Step 1: Infrastructure Setup** - [ ] Not Started | [ ] In Progress | [ ] Completed
- **Step 2: Frigate Configuration** - [ ] Not Started | [ ] In Progress | [ ] Completed
- **Step 3: Build and Deploy Docker Images** - [ ] Not Started | [ ] In Progress | [ ] Completed
- **Step 4: Deploy to Cloud Run** - [ ] Not Started | [ ] In Progress | [ ] Completed
- **Step 5: Deploy Frontend** - [ ] Not Started | [ ] In Progress | [ ] Completed
- **Step 6: Configure Monitoring and Logging** - [ ] Not Started | [ ] In Progress | [ ] Completed
- **Step 7: Verification** - [ ] Not Started | [ ] In Progress | [ ] Completed

## Best Practices

- **Security**: Use IAM roles to restrict access to resources and enable SSL/TLS for secure communication.
- **Monitoring**: Set up alerts for resource usage, error rates, and subscription limits.
- **Data Management**: Implement data retention policies and backup strategies.
- **Scalability**: Use auto-scaling features based on usage patterns and resource requirements.

## Dependencies

### Backend Dependencies
- `scikit-build == 0.18.*`
- `nvidia-pyindex`

### Frontend Dependencies
- `@cycjimmy/jsmpeg-player`: ^6.1.1
- `@firebase/auth`: ^1.9.0
- `@hookform/resolvers`: ^3.9.0
- `@melloware/react-logviewer`: ^6.1.2
- `@radix-ui/react-alert-dialog`: ^1.1.2
- `@radix-ui/react-aspect-ratio`: ^1.1.0
- `@radix-ui/react-checkbox`: ^1.1.2
- `@radix-ui/react-context-menu`: ^2.2.2
- `@radix-ui/react-dialog`: ^1.1.2
- `@radix-ui/react-dropdown-menu`: ^2.1.2
- `@radix-ui/react-hover-card`: ^1.1.2
- `@radix-ui/react-label`: ^2.1.0
- `@radix-ui/react-popover`: ^1.1.2
- `@radix-ui/react-radio-group`: ^1.2.1
- `@radix-ui/react-scroll-area`: ^1.2.0
- `@radix-ui/react-select`: ^2.1.2
- `@radix-ui/react-separator`: ^1.1.0
- `@radix-ui/react-slider`: ^1.2.1
- `@radix-ui/react-slot`: ^1.1.0
- `@radix-ui/react-switch`: ^1.1.1
- `@radix-ui/react-tabs`: ^1.1.1
- `@radix-ui/react-toggle`: ^1.1.0
- `@radix-ui/react-toggle-group`: ^1.1.0
- `@radix-ui/react-tooltip`: ^1.1.3
- `@stripe/react-stripe-js`: ^3.1.1
- `@stripe/stripe-js`: ^5.6.0
- `apexcharts`: ^3.52.0
- `axios`: ^1.7.7
- `class-variance-authority`: ^0.7.0
- `clsx`: ^2.1.1
- `cmdk`: ^1.0.0
- `copy-to-clipboard`: ^3.3.3
- `date-fns`: ^3.6.0
- `embla-carousel-react`: ^8.2.0
- `firebase`: ^11.3.1
- `firebase-tools`: ^13.31.2
- `framer-motion`: ^11.5.4
- `hls.js`: ^1.5.17
- `i18next`: ^23.10.0
- `i18next-browser-languagedetector`: ^7.2.0
- `idb-keyval`: ^6.2.1
- `immer`: ^10.1.1
- `konva`: ^9.3.16
- `lodash`: ^4.17.21
- `lucide-react`: ^0.407.0
- `monaco-yaml`: ^5.2.2
- `next-themes`: ^0.3.0
- `nosleep.js`: ^0.12.0
- `react`: ^18.3.1
- `react-apexcharts`: ^1.4.1
- `react-day-picker`: ^8.10.1
- `react-device-detect`: ^2.2.3
- `react-dom`: ^18.3.1
- `react-grid-layout`: ^1.5.0
- `react-hook-form`: ^7.52.1
- `react-i18next`: ^14.0.5
- `react-icons`: ^5.2.1
- `react-konva`: ^18.2.10
- `react-router-dom`: ^6.26.0
- `react-swipeable`: ^7.0.1
- `react-tracked`: ^2.0.1
- `react-transition-group`: ^4.4.5
- `react-use-websocket`: ^4.8.1
- `react-zoom-pan-pinch`: 3.4.4
- `recoil`: ^0.7.7
- `scroll-into-view-if-needed`: ^3.1.0
- `sonner`: ^1.5.0
- `sort-by`: ^1.2.0
- `strftime`: ^0.10.3
- `stripe`: ^17.6.0
- `swr`: ^2.2.5
- `tailwind-merge`: ^2.4.0
- `tailwind-scrollbar`: ^3.1.0
- `tailwindcss-animate`: ^1.0.7
- `use-long-press`: ^3.2.0
- `vaul`: ^0.9.1
- `vite-plugin-monaco-editor`: ^1.1.0
- `zod`: ^3.23.8

### DevDependencies
- `@tailwindcss/forms`: ^0.5.9
- `@testing-library/jest-dom`: ^6.6.2
- `@testing-library/react`: ^16.2.0
- `@types/lodash`: ^4.17.12
- `@types/node`: ^20.14.10
- `@types/react`: ^18.2.55
- `@types/react-dom`: ^18.2.19
- `@types/react-grid-layout`: ^1.3.5
- `@types/react-i18next`: ^8.1.0
- `@types/react-icons`: ^3.0.0
- `@types/react-transition-group`: ^4.4.10
- `@typescript-eslint/eslint-plugin`: ^7.5.0
- `@typescript-eslint/parser`: ^7.5.0
- `@vitejs/plugin-react-swc`: ^3.7.1
- `@vitest/coverage-v8`: ^2.0.5
- `autoprefixer`: ^10.4.20
- `eslint`: ^8.57.0
- `eslint-config-prettier`: ^9.1.0
- `eslint-plugin-jest`: ^28.2.0
- `eslint-plugin-prettier`: ^5.0.1
- `eslint-plugin-react-hooks`: ^4.6.0
- `eslint-plugin-react-refresh`: ^0.4.8
- `eslint-plugin-vitest-globals`: ^1.5.0
- `fake-indexeddb`: ^6.0.0
- `jest-websocket-mock`: ^2.5.0
- `jsdom`: ^24.1.1
- `msw`: ^2.3.5
- `postcss`: ^8.4.47
- `prettier`: ^3.3.3
- `prettier-plugin-tailwindcss`: ^0.6.5
- `tailwindcss`: ^3.4.9
- `typescript`: ^5.5.4
- `vite`: ^5.4.0
- `vitest`: ^2.0.5

## Environment Variables

### Frontend Environment Variables
- `VITE_FIREBASE_API_KEY`: Your Firebase API key.
- `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase Auth domain.
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID.
- `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket.
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID.
- `VITE_FIREBASE_APP_ID`: Your Firebase app ID.
- `VITE_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID (if using Google Analytics).

These environment variables should be set in your `.env` file or directly in your deployment environment to ensure the frontend can connect to Firebase services.

## Step 3: Firebase Setup

The Firebase CLI has been successfully installed and initialized for the project. The following configurations were made:

- **Project Association**: The project directory is associated with the Firebase project named `airys-video`.
- **Firestore Setup**: Firestore rules are stored in `firestore.rules`, and indexes are stored in `firestore.indexes.json`.
- **Hosting Setup**: The public directory for hosting assets is set to `public`, with default `404.html` and `index.html` files created.
- **Storage Setup**: Storage rules are stored in `storage.rules`.
- **Emulators Setup**: The Authentication and Firestore emulators were configured, with the Emulator UI enabled.

This step is now complete. Proceed to the next step in the deployment guide.

## Conclusion

By following this guide, you can successfully deploy your Frigate-based application to Google Cloud, ensuring it is secure, scalable, and maintainable. If you have any questions or need further assistance, feel free to ask!
