import flet as ft
import time
from . import mirrors, image_handler, docker_cli, cache_handler, config_handler, compose_handler

def main(page: ft.Page):
    # Page settings
    page.title = "MirrorBox"
    page.horizontal_alignment = ft.CrossAxisAlignment.CENTER
    page.vertical_alignment = ft.MainAxisAlignment.CENTER
    page.padding = 0
    page.theme_mode = ft.ThemeMode.DARK

    # --- Backend Logic ---
    def get_mirrors_to_try() -> list:
        config = config_handler.get_config()
        priority_mirror = config.get("priority_mirror")
        all_mirrors_status = [mirrors.check_mirror_status(m) for m in mirrors.MIRRORS]
        online_mirrors = sorted(
            [r for r in all_mirrors_status if r['status'] == 'Online ✅'],
            key=lambda r: r['latency']
        )
        if priority_mirror:
            priority_mirror_status = next(
                (m for m in all_mirrors_status if m['name'] == priority_mirror), None
            )
            if priority_mirror_status and priority_mirror_status['status'] == 'Online ✅':
                other_online_mirrors = [m for m in online_mirrors if m['name'] != priority_mirror]
                return [priority_mirror_status] + other_online_mirrors
        return online_mirrors

    # --- UI Controls ---
    results_view = ft.ListView(spacing=10, auto_scroll=True, expand=True, height=300)  # Set fixed height for scrolling
    image_name_input = ft.TextField(
        label="Image Name",
        hint_text="e.g., nginx:latest",
        border_color=ft.Colors.with_opacity(0.3, ft.Colors.WHITE),
        border_radius=15,
        focused_border_color="#00BFFF",
        color=ft.Colors.WHITE,
        autofocus=True
    )
    progress_ring = ft.ProgressRing(width=20, height=20, stroke_width=3, color="#00BFFF", visible=False)

    # --- Helpers ---
    def update_results(controls):
        results_view.controls = controls
        progress_ring.visible = False
        page.update()

    def show_loading(message):
        progress_ring.visible = True
        update_results([ft.Row([progress_ring, ft.Text(message)])])

    # --- Image Actions ---
    def pull_image_handler(e):
        image_name = image_name_input.value
        if not image_name:
            update_results([ft.Text("Please enter an image name.", color=ft.Colors.AMBER)])
            return

        def pull_in_thread():
            show_loading(f"Checking cache for {image_name}...")
            if cache_handler.load_image_from_cache(image_name):
                update_results([ft.Text(f"✅ Image '{image_name}' loaded from cache.", color=ft.Colors.GREEN)])
                return

            show_loading("Finding the best mirror...")
            mirrors_to_attempt = get_mirrors_to_try()
            if not mirrors_to_attempt:
                update_results([ft.Text("❌ No online mirrors found.", color=ft.Colors.RED)])
                return

            for i, mirror_info in enumerate(mirrors_to_attempt):
                mirror = mirror_info['name']
                show_loading(f"Attempting pull from {mirror} ({i+1}/{len(mirrors_to_attempt)})...")
                if docker_cli.pull_image_from_mirror(image_name, mirror):
                    show_loading(f"Saving '{image_name}' to cache...")
                    cache_handler.save_image_to_cache(image_name)
                    update_results([ft.Text(f"✅ Image '{image_name}' successfully pulled and cached.", color=ft.Colors.GREEN)])
                    return
            
            update_results([ft.Text(f"❌ Failed to pull '{image_name}' from any mirror.", color=ft.Colors.RED)])

        page.run_thread(pull_in_thread)

    def search_image_handler(e):
        image_name = image_name_input.value
        if not image_name:
            update_results([ft.Text("Please enter an image name.", color=ft.Colors.AMBER)])
            return

        def search_in_thread():
            show_loading(f"Searching for {image_name}...")
            statuses = []
            for mirror_host in mirrors.MIRRORS:
                status = mirrors.check_image_availability(mirror_host, image_name)
                statuses.append({"name": mirror_host, "status": status})

            controls = []
            for result in statuses:
                color = (
                    ft.Colors.GREEN if "✅" in result['status']
                    else ft.Colors.RED if "❌" in result['status']
                    else ft.Colors.AMBER
                )
                controls.append(
                    ft.Row([
                        ft.Icon(ft.Icons.STORAGE, color=ft.Colors.WHITE38),
                        ft.Text(result['name'], width=200),
                        ft.Text(result['status'], color=color, weight=ft.FontWeight.BOLD)
                    ])
                )
            update_results(controls)
        
        page.run_thread(search_in_thread)

    def list_mirrors_clicked(e):
        show_loading("Checking mirror status...")
        def list_in_thread():
            statuses = [mirrors.check_mirror_status(m) for m in mirrors.MIRRORS]
            statuses.sort(key=lambda r: (r['status'] != 'Online ✅', r['latency']))
            controls = []
            for mirror in statuses:
                status_color = ft.Colors.TEAL_ACCENT_400 if "✅" in mirror["status"] else ft.Colors.RED_400
                latency = f"{mirror['latency']}ms" if mirror['latency'] != float('inf') else "N/A"
                controls.append(ft.Row([
                    ft.Icon(ft.Icons.DNS, color=ft.Colors.WHITE38),
                    ft.Text(mirror["name"], width=200, weight=ft.FontWeight.W_500),
                    ft.Text(mirror["status"], color=status_color, weight=ft.FontWeight.BOLD),
                    ft.Text(latency, color=ft.Colors.WHITE38, italic=True),
                ]))
            update_results(controls)
        page.run_thread(list_in_thread)

    def list_images_clicked(e):
        show_loading("Fetching local Docker images...")
        def list_in_thread():
            images = image_handler.list_docker_images()
            controls = []
            if images:
                for image in images:
                    controls.append(ft.Row([
                        ft.Icon(ft.Icons.ALBUM, color=ft.Colors.WHITE38),
                        ft.Text(image['repository'], width=200, weight=ft.FontWeight.W_500),
                        ft.Text(image['tag'], width=100, color="#00BFFF"),
                        ft.Text(image['size'], color=ft.Colors.WHITE38),
                    ]))
            else:
                controls.append(ft.Text("No local images found.", color=ft.Colors.WHITE54))
            update_results(controls)
        page.run_thread(list_in_thread)

    # --- Cache Management ---
    def manage_cache_clicked(e):
        show_loading("Loading cache...")
        def load_cache_in_thread():
            cached_images = cache_handler.list_cached_images()
            controls = []
            if not cached_images:
                controls.append(ft.Text("Your cache is empty.", italic=True, color=ft.Colors.WHITE54))
            else:
                for item in cached_images:
                    def remove_cache_image(filename=item['filename']):
                        cache_handler.remove_image_from_cache(filename)
                        load_cache_in_thread()  # Refresh list
                    
                    controls.append(
                        ft.Row([
                            ft.Icon(ft.Icons.ARCHIVE, color="#00BFFF"),
                            ft.Text(item['filename'], expand=True),
                            ft.Text(f"{item['size_mb']} MB", color=ft.Colors.WHITE54),
                            ft.IconButton(
                                ft.Icons.DELETE_FOREVER,
                                icon_color=ft.Colors.RED_400,
                                on_click=lambda e, filename=item['filename']: remove_cache_image(filename),
                                tooltip="Delete from cache"
                            )
                        ])
                    )
            update_results(controls)
        page.run_thread(load_cache_in_thread)

    # --- Docker Compose Management ---
    def pull_compose_images_clicked(e):
        show_loading("Pulling Compose images...")
        def pull_in_thread():
            images_to_pull = compose_handler.get_images_from_compose_file()
            if not images_to_pull:
                update_results([ft.Text("❌ No images found in docker-compose.yml", color=ft.Colors.RED)])
                return
            for image in images_to_pull:
                docker_cli.pull_image_from_mirror(image, "docker.io") 
            update_results([ft.Text("✅ All Compose images pulled successfully", color=ft.Colors.GREEN)])
        page.run_thread(pull_in_thread)

    def run_compose_clicked(e):
        show_loading("Running docker-compose up -d...")
        def run_in_thread():
            success, output = compose_handler.run_compose_up()
            if success:
                update_results([ft.Text("✅ Docker Compose services started successfully!", color=ft.Colors.GREEN)])
            else:
                update_results([ft.Text(f"❌ Failed to run docker-compose:\n{output}", color=ft.Colors.RED)])
        page.run_thread(run_in_thread)

    # --- Main Layout ---
    main_card = ft.Container(
        width=500,
        padding=25,
        border_radius=20,
        bgcolor=ft.Colors.with_opacity(0.15, ft.Colors.BLACK),
        blur=ft.Blur(30, 30, ft.BlurTileMode.CLAMP),
        border=ft.border.all(1, ft.Colors.with_opacity(0.1, ft.Colors.WHITE)),
        content=ft.Column(
            controls=[
                ft.Row([
                    ft.Icon(ft.Icons.ROCKET_LAUNCH, color="#00BFFF", size=30),
                    ft.Text("MirrorBox", size=28, weight=ft.FontWeight.W_600),
                ]),
                ft.Text("Your Smart Docker Gateway", color=ft.Colors.WHITE70),
                ft.Divider(height=20, color=ft.Colors.with_opacity(0.2, ft.Colors.WHITE)),
                image_name_input,
                ft.Row(
                    controls=[
                        ft.ElevatedButton("Pull", icon=ft.Icons.DOWNLOAD, on_click=pull_image_handler, bgcolor="#00BFFF"),
                        ft.ElevatedButton("Search", icon=ft.Icons.SEARCH, on_click=search_image_handler, bgcolor=ft.Colors.WHITE24),
                    ],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN
                ),
                ft.Divider(height=10, color="transparent"),
                ft.Row(
                    controls=[
                        ft.TextButton("List Mirrors", icon=ft.Icons.LIST, on_click=list_mirrors_clicked),
                        ft.TextButton("List Images", icon=ft.Icons.IMAGE, on_click=list_images_clicked),
                    ],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN
                ),
                ft.TextButton("Manage Cache", icon=ft.Icons.ARCHIVE, on_click=manage_cache_clicked),
                ft.Row(
                    controls=[
                        ft.TextButton("Pull Compose Images", icon=ft.Icons.CLOUD_DOWNLOAD, on_click=pull_compose_images_clicked),
                        ft.TextButton("Run Compose", icon=ft.Icons.PLAY_CIRCLE, on_click=run_compose_clicked),
                    ],
                    alignment=ft.MainAxisAlignment.SPACE_BETWEEN
                ),
                ft.Container(
                    content=results_view,
                    margin=ft.margin.symmetric(vertical=10),
                    padding=10,
                    border_radius=10,
                    bgcolor=ft.Colors.with_opacity(0.1, ft.Colors.BLACK)
                )
            ]
        )
    )

    page.add(ft.Container(content=main_card, alignment=ft.alignment.center, expand=True))
    page.window_width = 600
    page.window_height = 750
    page.update()

def run():
    ft.app(target=main)
