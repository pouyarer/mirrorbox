import csv
from pathlib import Path
from datetime import datetime
from rich.console import Console

console = Console()

HISTORY_DIR = Path.home() / ".mirrorbox"
HISTORY_FILE = HISTORY_DIR / "history.csv"
FIELDNAMES = ["timestamp", "mirror", "event_type", "latency_ms", "success", "details"]

def setup_history_file():
    """Creates the history file with headers if it doesn't exist."""
    HISTORY_DIR.mkdir(parents=True, exist_ok=True)
    if not HISTORY_FILE.exists():
        with open(HISTORY_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
            writer.writeheader()

def log_event(mirror: str, event_type: str, success: bool, latency_ms: int = -1, details: str = ""):
    """Logs a new event to the history file."""
    setup_history_file()
    
    timestamp = datetime.now().isoformat()
    
    with open(HISTORY_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writerow({
            "timestamp": timestamp,
            "mirror": mirror,
            "event_type": event_type,
            "latency_ms": latency_ms,
            "success": success,
            "details": details
        })

def get_history() -> list:
    """Reads all history records from the CSV file."""
    if not HISTORY_FILE.exists():
        return []
    
    with open(HISTORY_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)