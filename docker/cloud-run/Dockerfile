# Use NVIDIA CUDA base image with L4 optimized version
FROM nvidia/cuda:12.1.1-cudnn8-runtime-ubuntu22.04

# Disable tokenizer parallelism warning and transformers advisory warnings
ENV TOKENIZERS_PARALLELISM=true \
    TRANSFORMERS_NO_ADVISORY_WARNINGS=1 \
    OPENCV_FFMPEG_LOGLEVEL=8 \
    DEBIAN_FRONTEND=noninteractive \
    NVIDIA_VISIBLE_DEVICES=all \
    NVIDIA_DRIVER_CAPABILITIES=compute,video,utility \
    CUDA_VISIBLE_DEVICES=0

# Install system dependencies
RUN set -ex && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        python3 \
        python3-dev \
        python3-pip \
        build-essential \
        pkg-config \
        libgl1-mesa-glx \
        libglib2.0-0 \
        ffmpeg \
        curl \
        gnupg \
        lsb-release \
        ca-certificates \
        # opencv dependencies
        libgtk-3-dev \
        libavcodec-dev \
        libavformat-dev \
        libswscale-dev \
        libv4l-dev \
        libxvidcore-dev \
        libx264-dev \
        libjpeg-dev \
        libpng-dev \
        libtiff-dev \
        gfortran \
        openexr \
        libatlas-base-dev \
        libssl-dev \
        libtbbmalloc2 \
        libtbb-dev \
        libdc1394-dev \
        libopenexr-dev \
        libgstreamer-plugins-base1.0-dev \
        libgstreamer1.0-dev \
    && rm -rf /var/lib/apt/lists/*

# Install gcsfuse
RUN set -ex && \
    curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt gcsfuse-$(lsb_release -c -s) main" | tee /etc/apt/sources.list.d/gcsfuse.list && \
    apt-get update && \
    apt-get install -y gcsfuse && \
    rm -rf /var/lib/apt/lists/*

# Create necessary directories
RUN set -ex && \
    mkdir -p /opt/frigate/web /tmp/cache /config /media/frigate /videos && \
    chmod -R 755 /opt/frigate /tmp/cache /config /media/frigate /videos

# Set working directory
WORKDIR /opt/frigate

# Create placeholder web files
RUN set -ex && \
    echo '{"version": "test"}' > /opt/frigate/web/version.json

# Install PyTorch with CUDA 12.1 support
RUN set -ex && \
    pip3 install --no-cache-dir torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Copy and install requirements
COPY requirements.txt .
RUN set -ex && \
    pip3 install --no-cache-dir -r requirements.txt

# Copy application files
COPY main.py .
COPY entrypoint.sh /entrypoint.sh

# Configure for Cloud Run
ENV PORT=8080
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8080}/health || exit 1

# Make entrypoint executable and set it
RUN set -ex && chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"] 