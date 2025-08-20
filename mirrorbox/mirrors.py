import requests
import time
from . import history_handler

# List of mirrors
MIRRORS = [
    "docker.arvancloud.ir",
    "focker.ir",
    "docker.iranserver.com",
    "hub.hamdocker.ir",

]

def check_mirror_status(mirror_url: str) -> dict:
    """
    Checks the status of a mirror and logs the result.
    """
    status_info = { "name": mirror_url, "status": "Offline ❌", "latency": float('inf') }
    success = False
    latency = -1
    
    try:
        start_time = time.time()
        response = requests.get(f"https://{mirror_url}/v2/", timeout=5)
        end_time = time.time()
        latency = round((end_time - start_time) * 1000)
        status_info["latency"] = latency

        if response.status_code in [200, 401]:
            status_info["status"] = "Online ✅"
            success = True
        else:
            status_info["status"] = f"Error ({response.status_code}) ⚠️"

    except requests.exceptions.RequestException:
        pass
    
    # Log the result in history
    history_handler.log_event(
        mirror=mirror_url,
        event_type="health_check",
        success=success,
        latency_ms=latency
    )

    return status_info

def check_image_availability(mirror_url: str, image_name: str) -> str:
    """
    Checks the availability of an image on a specific mirror.
    """
    if ":" in image_name:
        name, tag = image_name.split(":", 1)
    else:
        name, tag = image_name, "latest"

    if "/" not in name:
        name = f"library/{name}"

    api_url = f"https://{mirror_url}/v2/{name}/manifests/{tag}"

    try:
        response = requests.head(api_url, timeout=5, headers={"Accept": "application/vnd.docker.distribution.manifest.v2+json"})
        if response.status_code == 200:
            return "Available ✅"
        elif response.status_code == 404:
            return "Not Found ❌"
        else:
            return f"Error ({response.status_code}) ⚠️"
    except requests.exceptions.RequestException:
        return "Network Error 🌐"
