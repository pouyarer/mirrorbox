import subprocess
import sys
import shutil
import requests
from rich.console import Console
from . import history_handler, mirrors

console = Console()

def get_best_mirror():
    """Finds the fastest online mirror."""
    for mirror in mirrors.MIRRORS:
        if mirrors.check_mirror_status(mirror)['status'] == 'Online ✅':
            return mirror
    return None

def transform_image_name(image_arg: str, mirror: str) -> str:
    if "/" in image_arg and "." in image_arg.split("/")[0]:
        return image_arg
    
    name_part = image_arg
    tag = "latest"
    if ":" in image_arg:
        name_part, tag = image_arg.split(":", 1)
    
    if "/" not in name_part:
        name_part = f"library/{name_part}"
        
    return f"{mirror}/{name_part}:{tag}"

def proxy_docker_command(args: list):
    """Smart proxy for docker commands."""
    docker_path = shutil.which("docker")
    if not docker_path:
        console.print("[bold red]❌ Docker is not installed.[/]")
        sys.exit(1)

    image_commands = ["pull", "run", "create"]
    command = args[0] if args else ""
    new_args = list(args)
    
    if command in image_commands:
        best_mirror = get_best_mirror()
        if best_mirror:
            image_index = -1
            for i, arg in enumerate(args[1:], start=1):
                if not arg.startswith("-"):
                    image_index = i
                    break
            
            if image_index != -1:
                original_image = args[image_index]
                new_image = transform_image_name(original_image, best_mirror)
                new_args[image_index] = new_image
                console.print(f"[dim]🔄 Redirecting [cyan]{original_image}[/] via [green]{best_mirror}[/]...[/]")

    full_cmd = [docker_path] + new_args
    
    try:
        process = subprocess.run(full_cmd)
        history_handler.log_event(
            mirror="proxy-mode",
            event_type=f"docker {command}",
            success=(process.returncode == 0),
            latency_ms=0
        )
        if process.returncode != 0:
            sys.exit(process.returncode)
    except KeyboardInterrupt:
        console.print("\n[yellow]Operation cancelled.[/]")
    except Exception as e:
        console.print(f"[bold red]Error executing docker command: {e}[/]")

def search_image_in_mirrors(image_name: str):
    """Searches for an image across all mirrors."""
    results = []
    if ":" in image_name:
        name, tag = image_name.split(":", 1)
    else:
        name, tag = image_name, "latest"
    
    if "/" not in name:
        name = f"library/{name}"

    for mirror in mirrors.MIRRORS:
        url = f"https://{mirror}/v2/{name}/manifests/{tag}"
        try:
            resp = requests.head(url, timeout=3, allow_redirects=True)
            available = resp.status_code == 200
            results.append({
                "mirror": mirror,
                "available": available,
                "status_code": resp.status_code
            })
        except:
            results.append({
                "mirror": mirror,
                "available": False,
                "status_code": "Error"
            })
    return results

def run_compose_up(file_path: str):
    """Runs docker compose up -d."""
    try:
        cmd = ["docker", "compose", "-f", file_path, "up", "-d"]
        process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            return True, "Compose started successfully.\n" + stdout
        else:
            return False, f"Error:\n{stderr}"
    except Exception as e:
        return False, str(e)