import subprocess
import json
from typing import List, Dict

def list_docker_images() -> List[Dict]:
    """
    Returns list of local docker images using `docker images` command.
    """
    try:
        cmd = ["docker", "images", "--format", "{{json .}}"]
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            return []

        images = []
        for line in result.stdout.strip().split('\n'):
            if line:
                try:
                    img = json.loads(line)
                    images.append({
                        "repository": img.get("Repository", "<none>"),
                        "tag": img.get("Tag", "<none>"),
                        "id": img.get("ID", "")[:12],
                        "size": img.get("Size", "0B"),
                        "created": img.get("CreatedSince", "")
                    })
                except json.JSONDecodeError:
                    continue
        return images
    except Exception:
        return []

def remove_image(image_id: str):
    """Runs docker rmi."""
    try:
        subprocess.run(["docker", "rmi", image_id], check=True)
        return True
    except subprocess.CalledProcessError:
        return False