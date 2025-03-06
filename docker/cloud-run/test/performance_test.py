import asyncio
import aiohttp
import time
import json
import statistics
import argparse
from datetime import datetime, UTC
from typing import Dict, List, Any
import subprocess
import sys

class PerformanceTest:
    def __init__(self, service_url: str, auth_token: str = None):
        self.service_url = service_url
        self.headers = {
            "Authorization": f"Bearer {auth_token}" if auth_token else None,
            "Content-Type": "application/json"
        }
        self.results: Dict[str, Any] = {
            "timestamp": datetime.now(UTC).isoformat(),
            "service_url": service_url,
            "tests": {}
        }

    async def measure_latency(self, endpoint: str, payload: Dict = None, samples: int = 100) -> Dict[str, float]:
        """Measure endpoint latency."""
        latencies = []
        errors = 0
        async with aiohttp.ClientSession() as session:
            for _ in range(samples):
                start_time = time.time()
                try:
                    if payload:
                        async with session.post(f"{self.service_url}{endpoint}", 
                                            json=payload, 
                                            headers=self.headers) as response:
                            await response.json()
                    else:
                        async with session.get(f"{self.service_url}{endpoint}", 
                                            headers=self.headers) as response:
                            await response.json()
                    latencies.append((time.time() - start_time) * 1000)  # Convert to ms
                except Exception as e:
                    print(f"Error during latency test: {str(e)}")
                    errors += 1
                await asyncio.sleep(0.1)  # Prevent overwhelming the service

        if not latencies:
            return {
                "min": 0,
                "max": 0,
                "avg": 0,
                "median": 0,
                "p95": 0,
                "p99": 0,
                "error_rate": 1.0 if errors > 0 else 0
            }

        return {
            "min": min(latencies),
            "max": max(latencies),
            "avg": statistics.mean(latencies),
            "median": statistics.median(latencies),
            "p95": statistics.quantiles(latencies, n=20)[18],  # 95th percentile
            "p99": statistics.quantiles(latencies, n=100)[98],  # 99th percentile
            "error_rate": errors / samples if samples > 0 else 0
        }

    async def load_test(self, endpoint: str, payload: Dict = None, 
                       concurrent_users: int = 10, duration: int = 60) -> Dict[str, Any]:
        """Perform load testing with concurrent users."""
        start_time = time.time()
        request_count = 0
        error_count = 0
        latencies = []

        async def user_session():
            nonlocal request_count, error_count
            async with aiohttp.ClientSession() as session:
                while time.time() - start_time < duration:
                    try:
                        request_start = time.time()
                        if payload:
                            async with session.post(f"{self.service_url}{endpoint}", 
                                                  json=payload, 
                                                  headers=self.headers) as response:
                                await response.json()
                        else:
                            async with session.get(f"{self.service_url}{endpoint}", 
                                                 headers=self.headers) as response:
                                await response.json()
                        latencies.append((time.time() - request_start) * 1000)
                        request_count += 1
                    except Exception as e:
                        print(f"Error during load test: {str(e)}")
                        error_count += 1
                    await asyncio.sleep(0.1)  # Prevent overwhelming the service

        # Create concurrent user sessions
        users = [user_session() for _ in range(concurrent_users)]
        await asyncio.gather(*users)

        if not latencies:
            return {
                "duration": duration,
                "concurrent_users": concurrent_users,
                "total_requests": request_count,
                "requests_per_second": request_count / duration if duration > 0 else 0,
                "error_rate": 1.0 if error_count > 0 else 0,
                "latency_stats": {
                    "min": 0,
                    "max": 0,
                    "avg": 0,
                    "median": 0,
                    "p95": 0,
                    "p99": 0
                }
            }

        return {
            "duration": duration,
            "concurrent_users": concurrent_users,
            "total_requests": request_count,
            "requests_per_second": request_count / duration if duration > 0 else 0,
            "error_rate": error_count / (request_count + error_count) if request_count + error_count > 0 else 0,
            "latency_stats": {
                "min": min(latencies) if latencies else 0,
                "max": max(latencies) if latencies else 0,
                "avg": statistics.mean(latencies) if latencies else 0,
                "median": statistics.median(latencies) if latencies else 0,
                "p95": statistics.quantiles(latencies, n=20)[18] if latencies else 0,
                "p99": statistics.quantiles(latencies, n=100)[98] if latencies else 0
            }
        }

    def get_resource_metrics(self) -> Dict[str, Any]:
        """Get Cloud Run resource metrics using gcloud."""
        cmd = [
            "gcloud", "monitoring", "metrics", "list",
            f'--filter=metric.type = starts_with("run.googleapis.com/")',
            '--format=json'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return json.loads(result.stdout) if result.returncode == 0 else {}

    def get_gpu_metrics(self) -> Dict[str, Any]:
        """Get GPU-specific metrics if available."""
        cmd = [
            "gcloud", "monitoring", "metrics", "list",
            f'--filter=metric.type = starts_with("run.googleapis.com/container/nvidia_gpu")',
            '--format=json'
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        return json.loads(result.stdout) if result.returncode == 0 else {}

    async def run_full_test_suite(self, include_gpu_tests=True):
        """Run complete test suite including latency, load, and resource tests."""
        print("Starting performance test suite...")

        # Test endpoints
        endpoints = {
            "version": {"path": "/api/version", "method": "GET"},
            "inference": {
                "path": "/api/test/inference",
                "method": "POST",
                "payload": {"test_type": "cpu_inference"}
            },
            "storage": {"path": "/api/test/storage", "method": "GET"}
        }

        # Add GPU-specific endpoints if requested
        if include_gpu_tests:
            endpoints.update({
                "gpu_info": {"path": "/api/gpu/info", "method": "GET"},
                "gpu_inference": {
                    "path": "/api/test/inference",
                    "method": "POST",
                    "payload": {"test_type": "gpu_inference", "model_size": "medium"}
                },
                "gpu_video_processing": {
                    "path": "/api/test/video",
                    "method": "POST",
                    "payload": {"test_type": "gpu_processing", "duration": 5}
                }
            })

        # Latency tests
        print("Running latency tests...")
        for name, config in endpoints.items():
            print(f"Testing endpoint: {config['path']}")
            latency_results = await self.measure_latency(
                config["path"],
                config.get("payload"),
                samples=50
            )
            self.results["tests"][f"{name}_latency"] = latency_results

        # Load tests
        print("Running load tests...")
        for name, config in endpoints.items():
            print(f"Load testing endpoint: {config['path']}")
            load_results = await self.load_test(
                config["path"],
                config.get("payload"),
                concurrent_users=5,
                duration=30
            )
            self.results["tests"][f"{name}_load"] = load_results

        # Resource metrics
        print("Collecting resource metrics...")
        self.results["resource_metrics"] = self.get_resource_metrics()
        
        # GPU metrics if available
        if include_gpu_tests:
            print("Collecting GPU metrics...")
            self.results["gpu_metrics"] = self.get_gpu_metrics()

        # Add hardware info
        self.results["hardware_info"] = self.get_hardware_info()

        return self.results
    
    def get_hardware_info(self) -> Dict[str, Any]:
        """Get hardware information from the service."""
        try:
            cmd = [
                "curl", "-s", "-H", f"Authorization: Bearer {self.headers['Authorization']}" 
                if self.headers.get('Authorization') else "", 
                f"{self.service_url}/api/version"
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                return json.loads(result.stdout)
            return {"error": "Failed to get hardware info"}
        except Exception as e:
            return {"error": str(e)}

def main():
    parser = argparse.ArgumentParser(description="Run performance tests for Cloud Run service")
    parser.add_argument("--service-url", required=True, help="Cloud Run service URL")
    parser.add_argument("--auth-token", help="Authentication token")
    parser.add_argument("--output", help="Output file for results")
    parser.add_argument("--skip-gpu", action="store_true", help="Skip GPU-specific tests")
    args = parser.parse_args()

    tester = PerformanceTest(args.service_url, args.auth_token)
    results = asyncio.run(tester.run_full_test_suite(not args.skip_gpu))

    if args.output:
        with open(args.output, 'w') as f:
            json.dump(results, f, indent=2)
    else:
        print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main() 