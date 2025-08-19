import yaml
from pathlib import Path
from rich.console import Console

console = Console()

def get_images_from_compose_file() -> list[str]:
    """
    Finds the docker-compose.yml file and extracts the list of images from it.
    """
    compose_path = Path("docker-compose.yml")
    if not compose_path.exists():
        # If the standard filename is not found, try docker-compose.yaml
        compose_path = Path("docker-compose.yaml")
        if not compose_path.exists():
            console.print("[bold red]❌ No docker-compose.yml or docker-compose.yaml file found.[/]")
            return None

    console.print(f"[cyan]File [bold]{compose_path}[/] found. Reading services...[/]")

    try:
        with open(compose_path, 'r') as f:
            compose_data = yaml.safe_load(f)

        if not compose_data or 'services' not in compose_data:
            console.print("[bold yellow]⚠️ Your compose file is empty or does not have a 'services' section.[/]")
            return []

        images = []
        for service_name, service_config in compose_data['services'].items():
            if 'image' in service_config:
                images.append(service_config['image'])

        return images
    except Exception as e:
        console.print(f"[bold red]Error reading docker-compose file: {e}[/]")
        return None