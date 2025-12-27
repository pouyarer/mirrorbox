import typer
import sys
from rich.console import Console
from rich.table import Table
from mirrorbox import docker_cli, config_handler, gui_app, help_formatter

gui_cli = typer.Typer(
    help="MirrorBox v2: Enterprise Docker Mirror Client",
    add_completion=False,
    context_settings={"help_option_names": ["-h", "--help"]}
)
console = Console()


@gui_cli.command(name="open", help="🖥️  Launch the GUI.")
def open_gui():
    console.print("[bold cyan]Starting MirrorBox GUI...[/]")
    gui_app.start_webview()

@gui_cli.command(name="setup", help="🔧 Configure Daemon (Root).")
def setup_server():
    config_handler.setup_daemon_mirrors()

@gui_cli.command(name="unsetup", help="🔙 Restore default config.")
def remove_setup():
    config_handler.remove_daemon_mirrors()

@gui_cli.command(name="search", help="🔎 Search images.")
def search(image_name: str):
    console.print(f"Searching for [cyan]{image_name}[/]...")
    results = docker_cli.search_image_in_mirrors(image_name)
    table = Table(title=f"Search Results: {image_name}")
    table.add_column("Mirror", style="magenta")
    table.add_column("Status", justify="center")
    for r in results:
        status = "✅ Found" if r['available'] else "❌ Not Found"
        color = "green" if r['available'] else "red"
        table.add_row(r['mirror'], f"[{color}]{status}[/{color}]")
    console.print(table)

@gui_cli.command(name="compose", help="🐙 Docker Compose wrapper.")
def compose(
    action: str = typer.Argument(..., help="up, down, logs"),
    file: str = typer.Option("docker-compose.yml", "-f", "--file")
):
    import subprocess
    console.print(f"[bold]Running docker compose {action}...[/]")
    subprocess.run(["docker", "compose", "-f", file, action])

@gui_cli.command(name="help", help="📚 Show full docs.")
def show_help():
    help_formatter.print_full_help()


def app():
    args = sys.argv[1:]
    
    INTERNAL_COMMANDS = ["open", "setup", "unsetup", "search", "compose", "help"]

    if not args:
        help_formatter.print_full_help()
        return

    if args[0] in ["-h", "--help"]:
        help_formatter.print_full_help()
        return

    if args[0] in INTERNAL_COMMANDS:
        gui_cli()
        
    else:
        docker_cli.proxy_docker_command(args)

if __name__ == "__main__":
    app()