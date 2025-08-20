import subprocess
import sys
from rich.console import Console
from . import history_handler # <-- Import the history module

console = Console()

def pull_image_from_mirror(image_name: str, mirror: str) -> bool:
    """
    Pulls an image from the specified mirror, re-tags it, and logs the result.
    """
    if ":" in image_name:
        simple_name_no_tag, tag = image_name.split(":", 1)
    else:
        simple_name_no_tag, tag = image_name, "latest"

    if "/" not in simple_name_no_tag:
        full_image_name = f"library/{simple_name_no_tag}"
    else:
        full_image_name = simple_name_no_tag
    
    mirrored_image_with_tag = f"{mirror}/{full_image_name}:{tag}"

    console.print(f"Attempting to pull image [bold cyan]{mirrored_image_with_tag}[/]...")
    command = ["docker", "pull", mirrored_image_with_tag]
    
    success = False
    details = ""

    try:
        process = subprocess.Popen(
            command, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, encoding='utf-8'
        )
        # We collect the output to display in case of an error
        output_lines = []
        for line in iter(process.stdout.readline, ''):
            if line:
                print(line.strip())
                output_lines.append(line.strip())
        process.wait()

        if process.returncode == 0:
            console.print(f"✅ Image successfully pulled from {mirror}.")
            try:
                console.print(f"Re-tagging image to [cyan]{image_name}[/]...")
                tag_command = ["docker", "tag", mirrored_image_with_tag, image_name]
                subprocess.run(tag_command, check=True, capture_output=True)
                console.print(f"✅ Tagging successful.")
                success = True
            except subprocess.CalledProcessError as e:
                details = f"Tagging failed: {e.stderr.strip()}"
                console.print(f"[bold red]❌ Error tagging image: {details}[/]")
        else:
            details = "Pull command failed."
            console.print(f"[bold red]❌ Failed to pull image from {mirror}.[/]")

    except Exception as e:
        details = str(e)
        console.print(f"[bold red]An unexpected error occurred: {details}[/]")
    
    # --- New section: Log the pull result to history ---
    history_handler.log_event(
        mirror=mirror,
        event_type="pull_attempt",
        success=success,
        details=f"image: {image_name}, error: {details}" if not success else f"image: {image_name}"
    )

    return success
