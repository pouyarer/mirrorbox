import json
from pathlib import Path
from rich.console import Console

console = Console()

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

def save_config(new_config: dict):
    """Writes the new configuration to the config file."""
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    with open(CONFIG_FILE, 'w') as f:
        json.dump(new_config, f, indent=4)