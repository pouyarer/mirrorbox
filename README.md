# MirrorBox 🚀

**A smart, caching proxy for Docker, designed to bypass registry restrictions and accelerate your image pulls.**

MirrorBox is a modern command-line tool that acts as a smart gateway for Docker. It intelligently routes your Docker image requests through the fastest available mirrors, caches images locally for offline access, and seamlessly integrates with your development workflow.

---

## ✨ Key Features

MirrorBox streamlines your Docker experience with a powerful set of features, prioritized for maximum impact:

- ✅ **Accelerated Image Pulls:** The core feature. MirrorBox automatically benchmarks and selects the fastest, most reliable mirror before every download, dramatically speeding up `docker pull`.
- ✅ **Seamless Docker Compose Integration:** Simply replace `docker-compose up` with `mirrorbox compose up`. The tool pre-fetches all required images for your services using the best mirrors, ensuring your projects start without delay.
- ✅ **Intelligent Local Caching:** Pulled images are automatically cached locally. Subsequent requests for the same image are served instantly from your disk, saving bandwidth and enabling offline work.
- ✅ **Full Cache Management:** Take control of your local cache with simple commands to `list`, `save`, and `remove` cached images.
- ✅ **Configuration Control:** Customize MirrorBox to your needs. Set a `priority_mirror` to always use your favorite registry first.
- ✅ **Complete Docker Integration:** List all images currently in your Docker daemon with `list-images` for a unified experience.
- ✅ **Live Monitoring & Reporting:** Get a live dashboard of mirror statuses with `monitor start` and review performance history with `report show`.

---

## 📦 Installation

With Python 3.10+ and `pip` installed, you can install MirrorBox directly from GitHub with a single command. This is the recommended method for getting the latest version.

```bash
pip install git+[https://github.com/pouyarer/mirrorbox.git](https://github.com/pouyarer/mirrorbox.git)

🛠️ Usage Quick Start
Here are some examples of the most common commands.

1. Pulling an Image (The Smart Way)
MirrorBox first checks its local cache. If the image isn't there, it finds the best mirror, pulls the image, re-tags it, and saves it to the cache for next time.

mirrorbox pull nginx:latest


2. Working with Docker Compose
Navigate to your project directory (where docker-compose.yml is located) and run:

mirrorbox compose up -d

MirrorBox will read your file, pull all required images, and then execute docker compose up -d.

3. Managing the Cache

# List all images saved in the cache
mirrorbox cache list

# Manually save an image you already have to the cache
mirrorbox cache save httpd:latest

# Remove an image from the cache
mirrorbox cache remove httpd-latest.tar


4. Viewing All Your Docker Images
Get a clean, table-formatted view of all images loaded in your Docker daemon.

mirrorbox list-images

5. Monitoring Mirrors
Launch a live dashboard to monitor mirror status (updates every 5 seconds by default).

mirrorbox monitor start --interval 5

📄 License
Copyright (c) 2025 Pouya Rezapour. All Rights Reserved. See the LICENSE file for more details.

