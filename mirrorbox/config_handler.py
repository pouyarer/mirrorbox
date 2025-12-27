import json
import sys
import os
import subprocess
from pathlib import Path
from rich.console import Console

console = Console()

# --- User Configuration (Local) ---
CONFIG_DIR = Path.home() / ".mirrorbox"
CONFIG_FILE = CONFIG_DIR / "config.json"
DEFAULT_CONFIG = { "priority_mirror": None }

def get_config() -> dict:
    if not CONFIG_FILE.exists():
        CONFIG_DIR.mkdir(parents=True, exist_ok=True)
        with open(CONFIG_FILE, 'w') as f:
            json.dump(DEFAULT_CONFIG, f, indent=4)
        return DEFAULT_CONFIG
    
    with open(CONFIG_FILE, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return DEFAULT_CONFIG

# --- System Configuration (Global) ---

IRAN_MIRRORS = [
    "https://docker.arvancloud.ir",
    "https://focker.ir",
]

ANTI_SANCTION_DNS = [
    "178.22.122.100",
    "185.51.200.2"
]

def get_daemon_path():
    """Returns the correct daemon.json path based on OS."""
    if sys.platform.startswith("linux"):
        return Path("/etc/docker/daemon.json")
    elif sys.platform == "darwin":
        # Docker Desktop on Mac
        return Path.home() / ".docker" / "daemon.json"
    else:
        return None

def setup_daemon_mirrors():
    """
    Configures Docker Daemon for both Linux (Server) and macOS (Docker Desktop).
    """
    daemon_path = get_daemon_path()
    
    if not daemon_path:
        console.print("[red]❌ Windows support is coming soon. Please use 'mirrorbox run' for now.[/]")
        return

    # --- LINUX CHECKS ---
    if sys.platform.startswith("linux"):
        if os.geteuid() != 0:
            venv_python = sys.executable 
            console.print("[bold red]❌ Permission Denied (Root Required).[/]")
            console.print(f"Run: [bold green]sudo {venv_python} -m mirrorbox.cli setup[/bold green]")
            return

    # --- CONFIGURATION LOGIC ---
    console.print(f"[cyan]🔄 Configuring Docker Daemon at {daemon_path}...[/]")

    data = {}
    if daemon_path.exists():
        try:
            with open(daemon_path, "r") as f:
                content = f.read().strip()
                if content:
                    data = json.loads(content)
        except Exception:
            console.print("[yellow]⚠️  Existing config file was corrupted. Creating a new one.[/]")

    current_mirrors = data.get("registry-mirrors", [])
    updated_mirrors = list(set(current_mirrors + IRAN_MIRRORS))
    data["registry-mirrors"] = updated_mirrors

    current_dns = data.get("dns", [])
    new_dns = [d for d in ANTI_SANCTION_DNS if d not in current_dns] + current_dns
    data["dns"] = new_dns

    try:
        daemon_path.parent.mkdir(parents=True, exist_ok=True)
        with open(daemon_path, "w") as f:
            json.dump(data, f, indent=4)
        
        console.print("[green]✅ Configuration saved successfully.[/]")
        
        # --- RESTART LOGIC ---
        if sys.platform.startswith("linux"):
            _restart_docker_linux()
        elif sys.platform == "darwin":
            console.print("\n[bold yellow]⚠️  Action Required on macOS:[/]")
            console.print("Docker Desktop does not support auto-restart via CLI.")
            console.print("Please [bold]Restart Docker Desktop[/] manually to apply changes.")
            console.print("(Click Docker Icon in top bar -> Restart)")

    except Exception as e:
        console.print(f"[bold red]❌ Failed to save configuration: {e}[/]")
        if sys.platform == "darwin":
             console.print("[dim]Tip: You might need to grant Full Disk Access to Terminal if fails.[/dim]")

def remove_daemon_mirrors():
    daemon_path = get_daemon_path()
    if not daemon_path or not daemon_path.exists():
        console.print("[yellow]⚠️  No configuration found.[/]")
        return

    # Linux root check
    if sys.platform.startswith("linux") and os.geteuid() != 0:
         console.print("[red]❌ Root required.[/]")
         return

    try:
        with open(daemon_path, "r") as f:
            data = json.load(f)

        # Cleanup Mirrors
        current_mirrors = data.get("registry-mirrors", [])
        cleaned_mirrors = [m for m in current_mirrors if m not in IRAN_MIRRORS]
        if cleaned_mirrors:
            data["registry-mirrors"] = cleaned_mirrors
        else:
            data.pop("registry-mirrors", None)

        # Cleanup DNS
        current_dns = data.get("dns", [])
        cleaned_dns = [d for d in current_dns if d not in ANTI_SANCTION_DNS]
        if cleaned_dns:
            data["dns"] = cleaned_dns
        else:
            data.pop("dns", None)

        with open(daemon_path, "w") as f:
            json.dump(data, f, indent=4)

        console.print("[green]✅ Configuration restored.[/]")
        
        if sys.platform.startswith("linux"):
            _restart_docker_linux()
        elif sys.platform == "darwin":
            console.print("[bold yellow]Please Restart Docker Desktop manually.[/]")

    except Exception as e:
        console.print(f"[bold red]❌ Error: {e}[/]")

def _restart_docker_linux():
    console.print("[cyan]🔄 Restarting Docker Service...[/]")
    try:
        subprocess.run(["systemctl", "daemon-reload"], check=True)
        subprocess.run(["systemctl", "restart", "docker"], check=True)
        console.print("[bold green]🚀 Docker restarted successfully![/]")
    except Exception:
        console.print("[bold red]❌ Failed to restart automatically. Run `sudo systemctl restart docker`.[/]")