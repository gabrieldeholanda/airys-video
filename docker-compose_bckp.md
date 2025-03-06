version: "3.9"
services:
  devcontainer:
    container_name: frigate-devcontainer
    # add groups from host for render, plugdev, video
    group_add:
      - "109" # render
      - "110" # render
      - "44"  # video
      - "46"  # plugdev
    shm_size: "256mb"
    build:
      context: .
      dockerfile: docker/main/Dockerfile
      # Use target devcontainer-trt for TensorRT dev
      target: devcontainer
    ## Uncomment this block for nvidia gpu support
    # deploy:
    #       resources:
    #           reservations:
    #               devices:
    #                   - driver: nvidia
    #                     count: 1
    #                     capabilities: [gpu]
    environment:
      YOLO_MODELS: ""
    devices:
      - /dev/bus/usb:/dev/bus/usb
      # - /dev/dri:/dev/dri # for intel hwaccel, needs to be updated for your hardware
    volumes:
      - .:/workspace/frigate:cached
      - ./web/dist:/opt/frigate/web:cached
      - /etc/localtime:/etc/localtime:ro
      - ./config:/config
      - ./debug:/media/frigate
      - /dev/bus/usb:/dev/bus/usb
  mqtt:
    container_name: mqtt
    image: eclipse-mosquitto:latest
    restart: unless-stopped
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto:/mosquitto/config
  airys-video:
    container_name: airys-video
    build:
      context: .
      dockerfile: docker/main/Dockerfile
      target: frigate
    privileged: true
    shm_size: "128mb"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /dev/bus/usb:/dev/bus/usb
      - ./config:/config
      - ./media:/media
      - ./frigate/version.py:/opt/frigate/frigate/version.py
    ports:
      - "5000:5000"
      - "8554:8554"
      - "8555:8555/tcp"
      - "8555:8555/udp"
    environment:
      - FRIGATE_RTSP_PASSWORD=password
    restart: unless-stopped
    network_mode: host

  frigate:
    container_name: frigate
    privileged: true  # Required for OpenCL GPU access
    restart: unless-stopped
    build:
      context: .
      dockerfile: docker/main/Dockerfile
      target: frigate
    shm_size: "64mb"  # Shared memory for camera buffers
    devices:
      - /dev/dri:/dev/dri  # For hardware acceleration
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./config:/config
      - /media/frigate/clips:/media/frigate/clips  # Snapshots
      - /media/frigate/recordings:/media/frigate/recordings  # 24/7 recordings
      - /media/frigate/exports:/media/frigate/exports  # Exported clips
      - type: tmpfs  # Improve performance with RAM cache
        target: /tmp/cache
        tmpfs:
          size: 1000000000  # 1GB
    ports:
      - "5000:5000"  # UI
      - "8554:8554"  # RTSP restreaming
      - "8555:8555"  # WebRTC
      - "8971:8971"  # Authenticated API/UI
    environment:
      FRIGATE_RTSP_PASSWORD: "password"
    depends_on:
      - mqtt
