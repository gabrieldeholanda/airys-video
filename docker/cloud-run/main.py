from fastapi import FastAPI, HTTPException, Body
import torch
import json
import os
import time
import numpy as np
from typing import Dict, Any, Optional

app = FastAPI()

def get_device_info() -> Dict[str, Any]:
    """Get information about available compute devices."""
    if torch.cuda.is_available():
        return {
            "type": "gpu",
            "available": True,
            "count": torch.cuda.device_count(),
            "name": torch.cuda.get_device_name(0),
            "device": "cuda"
        }
    return {
        "type": "cpu",
        "available": True,
        "count": 1,
        "name": "CPU",
        "device": "cpu"
    }

@app.get("/api/version")
async def get_version():
    """Get service version information."""
    try:
        with open("/opt/frigate/web/version.json") as f:
            version = json.load(f)
        version.update({"device_info": get_device_info()})
        return version
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/gpu/info")
async def gpu_info():
    """Get detailed GPU information."""
    device_info = get_device_info()
    
    if device_info["device"] == "cuda":
        # Get additional GPU details
        try:
            gpu_details = {
                "cuda_version": torch.version.cuda,
                "cudnn_version": torch.backends.cudnn.version(),
                "arch": torch.cuda.get_arch_list() if hasattr(torch.cuda, 'get_arch_list') else None,
                "memory": {
                    "allocated": torch.cuda.memory_allocated(),
                    "reserved": torch.cuda.memory_reserved(),
                    "max_allocated": torch.cuda.max_memory_allocated(),
                    "max_reserved": torch.cuda.max_memory_reserved()
                },
                "device_properties": {
                    "name": torch.cuda.get_device_name(0),
                    "capability": torch.cuda.get_device_capability(0),
                    "total_memory": torch.cuda.get_device_properties(0).total_memory
                }
            }
            return {
                "status": "ok",
                "device_info": device_info,
                "gpu_details": gpu_details
            }
        except Exception as e:
            return {
                "status": "error",
                "device_info": device_info,
                "error": str(e)
            }
    
    return {
        "status": "no_gpu",
        "device_info": device_info
    }

@app.get("/api/test/gpu")
async def test_gpu():
    """Test GPU availability and capabilities."""
    device_info = get_device_info()
    return {
        "status": "ok",
        "device_info": device_info,
        "torch_version": torch.__version__
    }

@app.post("/api/test/inference")
async def test_inference(
    test_config: Dict[str, Any] = Body(
        {
            "test_type": "cpu_inference",
            "model_size": "small"
        }
    )
):
    """Test inference capabilities with configurable parameters."""
    device_info = get_device_info()
    device = device_info["device"]
    test_type = test_config.get("test_type", "cpu_inference")
    model_size = test_config.get("model_size", "small")
    
    # Define matrix sizes based on model_size parameter
    size_map = {
        "small": 1000,
        "medium": 5000,
        "large": 10000
    }
    matrix_size = size_map.get(model_size, 1000)
    
    try:
        start_time = time.time()
        
        if test_type == "gpu_inference" and device == "cuda":
            # GPU-specific test with larger matrices
            x = torch.randn(matrix_size, matrix_size, device=device)
            y = torch.matmul(x, x.t())
            # Force synchronization to get accurate timing
            torch.cuda.synchronize()
        else:
            # CPU fallback or standard test
            x = torch.randn(matrix_size, matrix_size).to(device)
            y = torch.matmul(x, x.t())
            
        elapsed_time = time.time() - start_time
        
        return {
            "status": "ok",
            "test_type": test_type,
            "model_size": model_size,
            "device_info": device_info,
            "matrix_shape": list(y.shape),
            "device": str(y.device),
            "memory_allocated": torch.cuda.memory_allocated() if device == "cuda" else None,
            "elapsed_time": elapsed_time,
            "operations_per_second": (matrix_size * matrix_size * matrix_size) / elapsed_time
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/test/video")
async def test_video_processing(
    test_config: Dict[str, Any] = Body(
        {
            "test_type": "cpu_processing",
            "duration": 5,
            "resolution": "720p"
        }
    )
):
    """Simulate video processing workload."""
    device_info = get_device_info()
    device = device_info["device"]
    test_type = test_config.get("test_type", "cpu_processing")
    duration = min(int(test_config.get("duration", 5)), 30)  # Cap at 30 seconds
    
    # Define frame sizes based on resolution
    resolution_map = {
        "480p": (640, 480),
        "720p": (1280, 720),
        "1080p": (1920, 1080),
        "4k": (3840, 2160)
    }
    width, height = resolution_map.get(test_config.get("resolution", "720p"), (1280, 720))
    
    try:
        start_time = time.time()
        frames_processed = 0
        fps = 30  # Simulated frames per second
        total_frames = duration * fps
        
        # Simulate video processing workload
        if test_type == "gpu_processing" and device == "cuda":
            # GPU-accelerated processing simulation
            frame = torch.rand(3, height, width, device=device)
            
            for _ in range(total_frames):
                # Simulate frame processing operations
                processed = torch.nn.functional.conv2d(
                    frame.unsqueeze(0),
                    torch.rand(16, 3, 3, 3, device=device),
                    padding=1
                )
                processed = torch.nn.functional.max_pool2d(processed, 2)
                frames_processed += 1
                
            # Force synchronization
            torch.cuda.synchronize()
        else:
            # CPU processing simulation
            frame = torch.rand(3, height, width)
            
            for _ in range(total_frames):
                # Simulate simpler operations for CPU
                processed = torch.nn.functional.avg_pool2d(
                    frame.unsqueeze(0), 
                    2
                )
                frames_processed += 1
        
        elapsed_time = time.time() - start_time
        actual_fps = frames_processed / elapsed_time
        
        return {
            "status": "ok",
            "test_type": test_type,
            "device_info": device_info,
            "resolution": f"{width}x{height}",
            "frames_processed": frames_processed,
            "elapsed_time": elapsed_time,
            "target_fps": fps,
            "actual_fps": actual_fps,
            "realtime_factor": actual_fps / fps
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test/storage")
async def test_storage():
    """Test storage access and operations."""
    try:
        storage_info = {
            "media_frigate": {
                "path": "/media/frigate",
                "exists": os.path.exists("/media/frigate"),
                "writable": os.access("/media/frigate", os.W_OK)
            },
            "videos": {
                "path": "/videos",
                "exists": os.path.exists("/videos"),
                "writable": os.access("/videos", os.W_OK)
            },
            "cache": {
                "path": "/tmp/cache",
                "exists": os.path.exists("/tmp/cache"),
                "writable": os.access("/tmp/cache", os.W_OK)
            }
        }
        return {
            "status": "ok",
            "storage_info": storage_info
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"} 