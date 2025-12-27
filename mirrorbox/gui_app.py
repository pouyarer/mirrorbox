import webview
import sys
import os
import json
import time
import requests
import webbrowser
from . import docker_cli, mirrors, cache_handler, config_handler, image_handler

class Api:
    """Methods available to the React Frontend"""
    
    def get_initial_state(self):
        return {
            "mirrors": [m for m in mirrors.MIRRORS],
            "config": config_handler.get_config()
        }

    def check_mirrors(self):
        return [mirrors.check_mirror_status(m) for m in mirrors.MIRRORS]

    def get_network_stats(self):
        """
        Calculates REAL network latency by checking mirrors in priority order.
        If the first one is down, it checks the next one.
        """
        latency = 0
        success = False
        
        for mirror_host in mirrors.MIRRORS:
            target_url = f"https://{mirror_host}"
            try:
                start_time = time.time()
                requests.head(target_url, timeout=1)
                
                latency = int((time.time() - start_time) * 1000)
                success = True
                break 
            except requests.exceptions.RequestException:
                continue
            
        return {
            "timestamp": time.strftime("%H:%M:%S"),
            "latency": latency if success else 0, 
            "download_speed": 0 
        }

    def list_local_images(self):
        try:
            images = image_handler.list_docker_images()
            return images if images else []
        except:
            return []

    def pull_image(self, image_name):
        print(f"Checking cache for: {image_name}")
        if cache_handler.load_image_from_cache(image_name):
             return {"success": True, "message": "Image loaded from Local Cache 📦"}

        print(f"Frontend requested pull: {image_name}")
        try:
            mirrors_to_try = mirrors.MIRRORS 
            success = False
            for mirror in mirrors_to_try:
                if docker_cli.pull_image_from_mirror(image_name, mirror):
                    success = True
                    break
            return {"success": success, "message": "Image pulled successfully" if success else "Failed to pull image"}
        except Exception as e:
            return {"success": False, "message": str(e)}

    def open_external_link(self, url):
        webbrowser.open(url)

    def search_image(self, image_name):
        print(f"Searching for: {image_name}")
        return docker_cli.search_image_in_mirrors(image_name)

    def select_compose_file(self):
        window = webview.windows[0]
        result = window.create_file_dialog(
            webview.OPEN_DIALOG, 
            allow_multiple=False, 
            file_types=('Docker Compose (*.yml;*.yaml)', 'All files (*.*)')
        )
        if result and len(result) > 0:
            return result[0]
        return None

    def run_compose(self, file_path):
        print(f"Running compose for: {file_path}")
        success, msg = docker_cli.run_compose_up(file_path)
        return {"success": success, "message": msg}

    def get_cache_list(self):
        return cache_handler.list_cached_images()

    def delete_cache_item(self, filename):
        cache_handler.remove_image_from_cache(filename)
        return self.get_cache_list()

    def save_image_to_cache(self, image_name):
        try:
            cache_handler.save_image_to_cache(image_name)
            return {"success": True, "message": f"{image_name} saved to cache."}
        except Exception as e:
            return {"success": False, "message": str(e)}

def start_webview():
    api = Api()
    base_dir = os.path.dirname(os.path.abspath(__file__))
    html_path = os.path.join(base_dir, 'dist', 'index.html')
    
    if not os.path.exists(html_path):
        window = webview.create_window('MirrorBox v2', html="<h1>Build Needed</h1>", js_api=api)
    else:
        window = webview.create_window(
            'MirrorBox v2', 
            url=html_path, 
            width=1200, 
            height=850, 
            resizable=True,
            background_color='#0a0a0c',
            js_api=api
        )
        
    webview.start(debug=False)