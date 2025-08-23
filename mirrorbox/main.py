import typer
from rich.console import Console
from rich.table import Table
from rich.live import Live
from rich.spinner import Spinner
import subprocess
import sys
from rich.panel import Panel
from typing import List
import shutil
import os
import time

# Project modules
import mirrorbox.mirrors as mirrors
import mirrorbox.docker_cli as docker_cli
import mirrorbox.compose_handler as compose_handler
import mirrorbox.cache_handler as cache_handler
import mirrorbox.config_handler as config_handler
import mirrorbox.history_handler as history_handler
import mirrorbox.image_handler as image_handler
import mirrorbox.gui_app as gui_app 

app = typer.Typer(
    help="MirrorBox: A smart tool for managing and pulling Docker images.",
    rich_markup_mode="markdown"
)

# --- Command Group Definitions ---
compose_app = typer.Typer(help="⚡️ Commands for managing Docker Compose projects.")
app.add_typer(compose_app, name="compose")

cache_app = typer.Typer(help="🗄 Manage the local image cache.")
app.add_typer(cache_app, name="cache")

config_app = typer.Typer(help="⚙️ View and manage MirrorBox settings.")
app.add_typer(config_app, name="config")

report_app = typer.Typer(help="📈 Reporting and viewing performance history.")
app.add_typer(report_app, name="report")

monitor_app = typer.Typer(help="🖥 Live dashboard for monitoring mirror status.")
app.add_typer(monitor_app, name="monitor")

console = Console()

# --- Helper Function for Mirror Selection ---
def get_mirrors_to_try() -> list:
    # This function is unchanged
    config = config_handler.get_config()
    priority_mirror = config.get("priority_mirror")
    all_mirrors_status = [mirrors.check_mirror_status(m) for m in mirrors.MIRRORS]
    online_mirrors = sorted([r for r in all_mirrors_status if r['status'] == 'Online ✅'], key=lambda r: r['latency'])
    if priority_mirror:
        priority_mirror_status = next((m for m in all_mirrors_status if m['name'] == priority_mirror), None)
        if priority_mirror_status and priority_mirror_status['status'] == 'Online ✅':
            console.print(f"[bold blue]⭐ Using priority mirror: {priority_mirror}[/]")
            other_online_mirrors = [m for m in online_mirrors if m['name'] != priority_mirror]
            return [priority_mirror_status] + other_online_mirrors
        else:
            console.print(f"[yellow]⚠️ Priority mirror '{priority_mirror}' is offline. Using the next fastest mirror...[/]")
    return online_mirrors

# --- Main Command Definitions ---
@app.command(name="open", help="🖥️  Opens the graphical user interface (GUI).")
def open_gui():
    """Launches the MirrorBox GUI using Flet."""
    console.print("[bold green]Launching MirrorBox GUI...[/]")
    gui_app.run()


@app.command(name="start", help="🚀 Shows a quick start guide with main commands.")
def start():
    """
    Displays a welcome panel and a quick start guide for MirrorBox.
    """
    
    welcome_message = """
[bold green]Welcome to MirrorBox![/bold green]
This tool is your smart gateway to Docker, designed to accelerate your image pulls.

[bold yellow]✨Graphical User Interface (GUI) ✨[/bold yellow]

For an easy, visual experience, try the MirrorBox GUI panel!
Just run the following command:
[bold cyan]mirrorbox open[/bold cyan]

In the GUI, you can:
- View mirror statuses and the list of your Docker images.
- Manage the local cache.
- Pull and run your Docker Compose projects.
---
[bold]Command-Line Interface (CLI) Guide[/bold]

[bold]Main & Daily Commands[/bold]
- [cyan]mirrorbox pull [underline]IMAGE[/underline][/cyan]: Smartly pulls an image from the cache or the best mirror.
- [cyan]mirrorbox compose up[/cyan]: Pre-pulls all images for a `docker-compose.yml` and then runs it.
- [cyan]mirrorbox list-mirrors[/cyan]: Checks the status and latency of all available mirrors.
- [cyan]mirrorbox search [underline]IMAGE[/underline][/cyan]: Finds if an image exists on the mirrors.
- [cyan]mirrorbox list-images[/cyan]: Lists all images currently in your Docker daemon.

[bold]Cache Management[/bold]
- [cyan]mirrorbox cache list[/cyan]: Lists all images saved in the local cache.
- [cyan]mirrorbox cache save [underline]IMAGE[/underline][/cyan]: Saves an image to the cache.
- [cyan]mirrorbox cache remove [underline]FILENAME[/underline][/cyan]: Removes an image from the cache.

[bold]Configuration[/bold]
- [cyan]mirrorbox config show[/cyan]: Shows the current configuration.
- [cyan]mirrorbox config set-priority [underline]MIRROR[/underline][/cyan]: Sets a preferred mirror.
- [cyan]mirrorbox config unset-priority[/cyan]: Unsets the priority mirror.

[bold]Monitoring & Reporting[/bold]
- [cyan]mirrorbox report show[/cyan]: Shows the history of operations.
- [cyan]mirrorbox monitor start[/cyan]: Launches a live dashboard to monitor mirrors.

For more details on any command, use the `--help` flag.
Example: `mirrorbox pull --help`
"""
    
    panel = Panel.fit(
        welcome_message,
        title="🎉 MirrorBox Quick Start Guide 🎉",
        border_style="blue",
        padding=(1, 2)
    )
    
    console.print(panel)


@app.command(name="list-images", help="🖼️  Display a list of all images in Docker (equivalent to `docker images`).")
def list_images():
    # This command is unchanged
    images = image_handler.list_docker_images()
    if images is None:
        return
    if not images:
        console.print("[yellow]No Docker images found.[/]")
        return
    table = Table(title="🐳 Docker Images")
    table.add_column("Repository", style="cyan")
    table.add_column("Tag", style="yellow")
    table.add_column("Image ID", style="dim")
    table.add_column("Size", justify="right", style="green")
    for image in images:
        table.add_row(image['repository'], image['tag'], image['id'], image['size'])
    console.print(table)


@app.command(name="list-mirrors", help="📊 Display a list of all Iranian mirrors and check their status.")
def list_mirrors():
    # This command is unchanged
    table = Table(title="🇮🇷 Status of Docker Mirrors in Iran")
    table.add_column("Mirror Address", justify="left", style="cyan", no_wrap=True)
    table.add_column("Status", justify="center", style="magenta")
    table.add_column("Response Time (ms)", justify="right", style="green")
    spinner = Spinner("dots", text="Checking mirrors...")
    with Live(spinner, transient=True, console=console) as live:
        results = [mirrors.check_mirror_status(m) for m in mirrors.MIRRORS]
    results.sort(key=lambda r: (r['status'] != 'Online ✅', r['latency']))
    for result in results:
        latency_str = str(result['latency']) if result['latency'] != float('inf') else "N/A"
        table.add_row(result['name'], result['status'], latency_str)
    console.print(table)


@app.command(name="search", help="🔎 Search for a specific image across all online mirrors.")
def search_image(image_name: str = typer.Argument(..., help="Name of the image, e.g., nginx or ubuntu:22.04")):
    # This command is unchanged
    table = Table(title=f"🔎 Search Results for Image [bold cyan]{image_name}[/]")
    table.add_column("Mirror Address", justify="left", style="cyan", no_wrap=True)
    table.add_column("Mirror Status", justify="center", style="magenta")
    table.add_column("Image Status", justify="center", style="yellow")
    spinner = Spinner("dots", text=f"Searching for {image_name}...")
    with Live(spinner, transient=True, console=console) as live:
        for mirror_host in mirrors.MIRRORS:
            mirror_status = mirrors.check_mirror_status(mirror_host)
            if mirror_status['status'] == 'Online ✅':
                image_status = mirrors.check_image_availability(mirror_host, image_name)
                table.add_row(mirror_host, mirror_status['status'], image_status)
            else:
                table.add_row(mirror_host, mirror_status['status'], "---")
    console.print(table)


@app.command(name="pull", help="📥 Pull an image from the priority mirror, the fastest mirror, or the local cache.")
def pull_image(image_name: str = typer.Argument(..., help="Name of the desired image, e.g., nginx:latest")):
    # This command is unchanged
    console.print(f"[bold]🚀 Starting process to pull image {image_name}...[/]")
    if cache_handler.load_image_from_cache(image_name):
        return
    console.print(f"[yellow]Image not found in local cache. Searching online mirrors...[/]")
    mirrors_to_attempt = get_mirrors_to_try()
    if not mirrors_to_attempt:
        console.print("[bold red]❌ No online mirrors found.[/]")
        raise typer.Exit(code=1)
    console.print(f"[green]✅ Found {len(mirrors_to_attempt)} online mirrors to try. Starting download...[/]")
    download_successful = False
    for mirror_info in mirrors_to_attempt:
        if docker_cli.pull_image_from_mirror(image_name, mirror_info['name']):
            download_successful = True
            break
    if not download_successful:
        console.print(f"[bold red]Failed: Could not pull the image {image_name}.[/]")
        raise typer.Exit(code=1)
    console.print("\n[bold blue]Download finished. Adding image to local cache...[/]")
    cache_handler.save_image_to_cache(image_name)

# --- Other Group Commands ---
@compose_app.command("up", help="Pulls docker-compose images and then runs the project.")
def compose_up(ctx: typer.Context):
    # This command is unchanged
    images_to_pull = compose_handler.get_images_from_compose_file()
    if images_to_pull is None:
        raise typer.Exit(code=1)
    if not images_to_pull:
        console.print("[yellow]No images to pull were found in the compose file.[/]")
    else:
        console.print(f"[bold blue]Identified {len(images_to_pull)} images: {', '.join(images_to_pull)}[/]")
        mirrors_to_attempt = get_mirrors_to_try()
        all_images_ready = True
        for image in images_to_pull:
            console.print(f"\n[bold]Checking image: {image}[/bold]")
            if cache_handler.load_image_from_cache(image):
                continue
            console.print(f"[yellow]Image {image} is not in cache. Attempting to download from mirrors...[/]")
            if not mirrors_to_attempt:
                console.print("[bold red]❌ No online mirrors available for download.[/]")
                all_images_ready = False
                break
            pulled_successfully = False
            for mirror_info in mirrors_to_attempt:
                if docker_cli.pull_image_from_mirror(image, mirror_info['name']):
                    pulled_successfully = True
                    cache_handler.save_image_to_cache(image)
                    break
            if not pulled_successfully:
                console.print(f"[bold red]❌ Failed to pull image {image}.[/]")
                all_images_ready = False
        if not all_images_ready:
            console.print("[bold red]Some images could not be prepared. Aborting compose up.[/]")
            raise typer.Exit(code=1)
    console.print("\n[bold green]✅ All images are ready.[/]")
    base_command = []
    try:
        subprocess.run(["docker", "compose", "--help"], check=True, capture_output=True)
        base_command = ["docker", "compose"]
    except (subprocess.CalledProcessError, FileNotFoundError):
        if shutil.which("docker-compose"):
            base_command = ["docker-compose"]
        else:
            console.print("[bold red]❌ No version of Docker Compose was found.[/]")
            raise typer.Exit(code=1)
    console.print(f"[bold blue]🚀 Running `{' '.join(base_command)} up`...[/]")
    compose_args = base_command + ["up"] + ctx.args
    try:
        process = subprocess.Popen(compose_args)
        process.wait()
    except KeyboardInterrupt:
        console.print("\n[yellow]Operation interrupted by user...[/]")
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()
        down_args = base_command + ["down"]
        subprocess.run(down_args)

@cache_app.command("save", help="Saves an existing Docker image to the local cache.")
def cache_save(image_name: str = typer.Argument(..., help="Full name of the image. Example: nginx:latest")):
    cache_handler.save_image_to_cache(image_name)

@cache_app.command("list", help="Lists all images saved in the local cache.")
def cache_list():
    # This command is unchanged
    console.print(f"📁 Cache directory path: [dim]{cache_handler.CACHE_DIR}[/]")
    cached_images = cache_handler.list_cached_images()
    if not cached_images:
        console.print("[yellow]The local cache is empty.[/]")
        return
    table = Table(title="🖼️ Images in Local Cache")
    table.add_column("Filename", style="cyan")
    table.add_column("Size (MB)", justify="right", style="green")
    for image_info in cached_images:
        table.add_row(image_info['filename'], str(image_info['size_mb']))
    console.print(table)


@cache_app.command("remove", help="Removes one or more images from the local cache.")
def cache_remove(filenames: list[str] = typer.Argument(..., help="Name of the files to be removed.")):
    # This command is unchanged
    if not filenames:
        console.print("[yellow]Please provide at least one filename to remove.[/]")
        return
    for name in filenames:
        cache_handler.remove_image_from_cache(name)


@config_app.command("show", help="Displays the current application settings.")
def config_show():
    # This command is unchanged
    console.print(f"⚙️ Config file path: [dim]{config_handler.CONFIG_FILE}[/]")
    config = config_handler.get_config()
    priority = config.get("priority_mirror")
    if priority:
        console.print(f"  - Priority mirror: [bold cyan]{priority}[/]")
    else:
        console.print("  - Priority mirror: [yellow]Not set[/yellow]")


@config_app.command("set-priority", help="Sets a mirror as the priority mirror.")
def config_set_priority(mirror_name: str = typer.Argument(..., help=f"Name of one of the supported mirrors.")):
    # This command is unchanged
    if mirror_name not in mirrors.MIRRORS:
        console.print(f"[bold red]❌ Mirror '{mirror_name}' is not supported.[/]")
        console.print(f"Please choose one of the following: {', '.join(mirrors.MIRRORS)}")
        raise typer.Exit(code=1)
    config = config_handler.get_config()
    config["priority_mirror"] = mirror_name
    config_handler.save_config(config)
    console.print(f"[bold green]✅ Priority mirror successfully set to [cyan]{mirror_name}[/].[/]")


@config_app.command("unset-priority", help="Unsets the priority mirror.")
def config_unset_priority():
    # This command is unchanged
    config = config_handler.get_config()
    if config.get("priority_mirror"):
        config["priority_mirror"] = None
        config_handler.save_config(config)
        console.print("[bold green]✅ Priority mirror successfully unset.[/]")
    else:
        console.print("[yellow]No priority mirror is set to be unset.[/]")


@report_app.command("show", help="Displays the performance history of mirrors.")
def report_show(limit: int = typer.Option(20, "--limit", "-l", help="Number of recent events to display.")):
    # This command is unchanged
    history = history_handler.get_history()
    if not history:
        console.print("[yellow]No history to display.[/]")
        return
    table = Table(title="📜 Mirror Performance History")
    table.add_column("Timestamp", style="dim")
    table.add_column("Mirror", style="cyan")
    table.add_column("Event Type", style="yellow")
    table.add_column("Result", justify="center")
    table.add_column("Latency (ms)", justify="right", style="green")
    for record in history[-limit:]:
        success_icon = "✅" if record.get('success') == 'True' else "❌"
        latency_str = record.get('latency_ms', 'N/A')
        if latency_str == '-1': latency_str = 'N/A'
        table.add_row(record.get('timestamp', '').replace("T", " "), record.get('mirror', ''), record.get('event_type', ''), success_icon, latency_str)
    console.print(table)


@monitor_app.command("start", help="Starts the live dashboard for monitoring mirrors.")
def monitor_start(
    interval: int = typer.Option(10, "--interval", "-i", help="Update interval in seconds.")
):
    # This command is unchanged
    def generate_table() -> Table:
        table = Table(title=f"🖥️ Live Mirror Status Dashboard (Updates every {interval}s)", caption="Press Ctrl+C to exit")
        table.add_column("Mirror Address", justify="left", style="cyan")
        table.add_column("Status", justify="center", style="magenta")
        table.add_column("Response Time (ms)", justify="right", style="green")
        results = [mirrors.check_mirror_status(m) for m in mirrors.MIRRORS]
        results.sort(key=lambda r: (r['status'] != 'Online ✅', r['latency']))
        for result in results:
            latency_str = str(result['latency']) if result['latency'] != float('inf') else "N/A"
            table.add_row(result['name'], result['status'], latency_str)
        return table
    try:
        with Live(generate_table(), screen=True, redirect_stderr=False, refresh_per_second=4) as live:
            while True:
                time.sleep(interval)
                live.update(generate_table())
    except KeyboardInterrupt:
        console.print("\n[yellow]Monitoring dashboard stopped.[/]")