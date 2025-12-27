from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.layout import Layout
from rich import box

console = Console()

def print_full_help():
    """
    Renders the complete Enterprise Documentation for MirrorBox v2.
    """
    # 1. Header
    title = Text("MirrorBox v2", style="bold cyan")
    subtitle = Text("ENTERPRISE DOCKER GATEWAY & ANTI-SANCTION TOOLKIT", style="bold white")
    
    console.print(Panel(
        Text.assemble(title, "\n", subtitle, justify="center"),
        style="cyan",
        border_style="cyan",
        padding=(1, 2)
    ))

    # 2. Introduction
    console.print("\n[bold]MirrorBox[/] is an intelligent wrapper around Docker that automatically optimizes your workflow for restricted environments (like Iran). It provides two main modes of operation:\n")

    # 3. Core Features (The Power)
    grid = Table.grid(expand=True, padding=(0, 2))
    grid.add_column(style="cyan", justify="right")
    grid.add_column(style="white")

    grid.add_row("🚀 [bold]Smart Proxy[/]", "Intercepts `pull` & `run` commands to inject high-speed mirrors on-the-fly.")
    grid.add_row("🛡️ [bold]Daemon Config[/]", "Configures Docker Daemon with [bold green]Mirrors + Anti-Sanction DNS[/] (Root required).")
    grid.add_row("📦 [bold]Local Cache[/]", "Auto-saves pulled images to local disk. Works offline!")
    grid.add_row("🔎 [bold]Multi-Search[/]", "Searches across multiple private & public mirrors simultaneously.")
    grid.add_row("🐙 [bold]Compose[/]", "Full support for Docker Compose projects.")
    
    console.print(Panel(grid, title="[bold]Core Capabilities[/]", border_style="white", title_align="left"))

    # 4. Commands Table
    table = Table(box=box.SIMPLE, show_header=True, header_style="bold magenta", expand=True)
    table.add_column("Command", style="cyan", width=25)
    table.add_column("Description", style="white")

    # --- CLI Tools ---
    table.add_row("[bold]mirrorbox open[/]", "Launch the Glassmorphism [bold]GUI Dashboard[/].")
    table.add_row("[bold]mirrorbox setup[/]", "configure [bold]/etc/docker/daemon.json[/] with Mirrors & DNS (Requires Sudo).")
    table.add_row("[bold]mirrorbox unsetup[/]", "Restore default Docker configuration (Removes mirrors/DNS).")
    table.add_row("[bold]mirrorbox search [name][/]", "Search for an image (e.g., `mirrorbox search nginx`).")
    table.add_row("[bold]mirrorbox compose [cmd][/]", "Wrapper for docker-compose (e.g., `mirrorbox compose up -d`).")
    
    # --- Docker Passthrough ---
    table.add_section()
    table.add_row("[bold]mirrorbox pull [image][/]", "Smart Pull: Finds the best mirror and downloads the image.")
    table.add_row("[bold]mirrorbox run [args]...[/]", "Smart Run: Injects mirrors, keeps all flags (`-d`, `-p`, `-v`).")
    table.add_row("[bold]mirrorbox [any_cmd][/]", "Pass-through: Executes any other docker command (`ps`, `logs`, `exec`).")

    console.print("\n[bold]Available Commands:[/]")
    console.print(table)

    # 5. Examples
    console.print("\n[bold]Usage Examples:[/]")
    
    ex_table = Table.grid(padding=(0, 2))
    ex_table.add_column(style="green")
    ex_table.add_column(style="dim white")
    
    ex_table.add_row("$ mirrorbox run -d -p 80:80 nginx", "# Auto-finds mirror for nginx and runs it")
    ex_table.add_row("$ sudo mirrorbox setup", "# Fixes Docker Daemon permanently (Recommended for Servers)")
    ex_table.add_row("$ mirrorbox search mysql", "# Checks availability across all mirrors")
    ex_table.add_row("$ mirrorbox open", "# Opens the visual dashboard")

    console.print(Panel(ex_table, border_style="dim"))
    
    # 6. Footer
    console.print("\n[dim]Powered by [bold]Testeto[/] | Developed by [cyan]PouyaRezapour.ir[/][/dim]")
    console.print("[dim]Documentation: https://github.com/pouyarer/mirrorbox[/dim]\n")