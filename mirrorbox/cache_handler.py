from pathlib import Path
import subprocess
from rich.console import Console

console = Console()

CACHE_DIR = Path.home() / ".mirrorbox" / "cache"

def ensure_cache_dir_exists():
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

def get_cache_filepath(image_name: str) -> Path:
    sanitized_name = image_name.replace("/", "_").replace(":", "-")
    return CACHE_DIR / f"{sanitized_name}.tar"

def save_image_to_cache(image_name: str) -> bool:
    ensure_cache_dir_exists()
    filepath = get_cache_filepath(image_name)
    console.print(f"Saving image [cyan]{image_name}[/] to local cache...")
    console.print(f"File path: [dim]{filepath}[/]")
    command = ["docker", "save", "-o", str(filepath), image_name]
    try:
        process = subprocess.run(command, check=True, capture_output=True, text=True)
        console.print(f"[bold green]✅ Image {image_name} successfully saved to cache.[/]")
        return True
    except FileNotFoundError:
        console.print("[bold red]Error: 'docker' command not found.[/]")
        return False
    except subprocess.CalledProcessError as e:
        console.print(f"[bold red]❌ Error saving image: {e.stderr.strip()}[/]")
        console.print(f"[yellow]Does the image '{image_name}' exist locally in your Docker daemon?[/]")
        return False
    except Exception as e:
        console.print(f"[bold red]An unexpected error occurred: {e}[/]")
        return False

def list_cached_images() -> list:
    """Returns a list of cached images along with their sizes."""
    ensure_cache_dir_exists()
    files = []
    for f in CACHE_DIR.glob("*.tar"):
        size_mb = f.stat().st_size / (1024 * 1024)
        files.append({"filename": f.name, "size_mb": round(size_mb, 2)})
    return files

def load_image_from_cache(image_name: str) -> bool:
    """Loads an image from the local cache into Docker."""
    filepath = get_cache_filepath(image_name)
    if not filepath.exists():
        return False

    console.print(f"Image [cyan]{image_name}[/] found in local cache. Loading...")
    command = ["docker", "load", "-i", str(filepath)]
    try:
        subprocess.run(command, check=True, capture_output=True, text=True)
        console.print(f"[bold green]✅ Image {image_name} successfully loaded from cache.[/]")
        return True
    except subprocess.CalledProcessError as e:
        console.print(f"[bold red]❌ Error loading image from cache: {e.stderr.strip()}[/]")
        return False
    except Exception as e:
        console.print(f"[bold red]An unexpected error occurred while loading from cache: {e}[/]")
        return False


def remove_image_from_cache(filename: str) -> bool:
    """Removes a specific file from the cache directory."""
    ensure_cache_dir_exists()
    filepath = CACHE_DIR / filename
    
    if not filepath.exists() or not filename.endswith(".tar"):
        console.print(f"[bold red]❌ File '{filename}' not found in cache.[/]")
        return False
    
    try:
        filepath.unlink()
        console.print(f"[bold green]✅ File '{filename}' successfully removed from cache.[/]")
        return True
    except Exception as e:
        console.print(f"[bold red]Error deleting file: {e}[/]")
        return False