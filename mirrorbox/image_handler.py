import subprocess
from rich.console import Console

console = Console()

def list_docker_images() -> list | None:
    """
    Gets and parses the list of existing Docker images in a specific format.
    """
    # Using format to get a clean and parsable output
    command = ["docker", "images", "--format", "{{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.Size}}"]
    
    try:
        process = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            encoding='utf-8'
        )
        
        output = process.stdout.strip()
        if not output:
            return []

        images = []
        for line in output.split('\n'):
            try:
                repo, tag, image_id, size = line.split('\t')
                images.append({
                    "repository": repo,
                    "tag": tag,
                    "id": image_id,
                    "size": size
                })
            except ValueError:
                # In case of unexpected lines, ignore them
                continue
        
        return images

    except FileNotFoundError:
        console.print("[bold red]Error: 'docker' command not found. Is Docker installed and running?[/]")
        return None
    except subprocess.CalledProcessError as e:
        console.print(f"[bold red]Error executing 'docker images' command: {e.stderr.strip()}[/]")
        return None