import os
import subprocess
import json
from pathlib import Path
from rich.console import Console

console = Console()

CACHE_DIR = Path.home() / ".mirrorbox" / "cache"

def ensure_cache_dir():
    if not CACHE_DIR.exists():
        CACHE_DIR.mkdir(parents=True, exist_ok=True)

def list_cached_images():
    """Returns a list of cached tarballs with their size."""
    ensure_cache_dir()
    files = []
    for f in CACHE_DIR.glob("*.tar"):
        size_mb = round(f.stat().st_size / (1024 * 1024), 2)
        files.append({
            "filename": f.name,
            "size_mb": size_mb,
            "path": str(f)
        })
    return files

def save_image_to_cache(image_name: str):
    """
    1. Pulls the image (if not present).
    2. Saves it as a tarball.
    """
    ensure_cache_dir()
    
    clean_name = image_name.replace("/", "_").replace(":", "_")
    output_path = CACHE_DIR / f"{clean_name}.tar"
    
    if output_path.exists():
        return f"Image {clean_name} already exists in cache."

    console.print(f"[cyan]Ensuring {image_name} is available locally...[/]")
    subprocess.run(["docker", "pull", image_name], check=True)
    
    console.print(f"[green]Saving {image_name} to cache...[/]")
    cmd = ["docker", "save", "-o", str(output_path), image_name]
    subprocess.run(cmd, check=True)
    
    return f"Successfully saved to {output_path.name}"

def load_image_from_cache(image_name: str) -> bool:
    """
    Checks if image exists in cache tarball, if so, loads it into Docker.
    Returns True if loaded from cache.
    """
    clean_name = image_name.replace("/", "_").replace(":", "_")
    tar_path = CACHE_DIR / f"{clean_name}.tar"
    
    if tar_path.exists():
        console.print(f"[bold yellow]📦 Found {image_name} in Local Cache. Loading...[/]")
        try:
            subprocess.run(["docker", "load", "-i", str(tar_path)], check=True)
            return True
        except Exception as e:
            console.print(f"[red]Failed to load cache: {e}[/]")
            return False
    return False

def remove_image_from_cache(filename: str):
    """Deletes the tarball."""
    ensure_cache_dir()
    path = CACHE_DIR / filename
    if path.exists():
        os.remove(path)
        return True
    return False