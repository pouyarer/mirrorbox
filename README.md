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

## 📦 Installation & Quick Start

MirrorBox requires **Python 3.10+**. It is strongly recommended to install it inside a **virtual environment** to avoid system package conflicts.

### 1️⃣ Create a Virtual Environment
```bash
python3 -m venv venv

2️⃣ Activate the Environment
source venv/bin/activate

3️⃣ Install MirrorBox from GitHub
pip install git+https://github.com/pouyarer/mirrorbox.git


## 🛠️ Usage / Commands

Here is a guide to all the available commands in MirrorBox.

### **1. Basic Mirror & Image Commands**

**Check Mirror Status**
Get a live report of all supported mirrors, their status, and latency.
```bash
mirrorbox list-mirrors
```

**Search for an Image**
Check which mirrors have a specific image tag available before pulling.
```bash
mirrorbox search nginx:latest
```

**Pull an Image (The Smart Way)**
MirrorBox first checks the local cache. If not found, it pulls from the best available mirror and then automatically saves the image to the cache for the next time.
```bash
mirrorbox pull ubuntu:22.04
```

**List Local Docker Images**
Get a clean, table-formatted view of all images currently loaded in your Docker daemon (similar to `docker images`).
```bash
mirrorbox list-images
```

### **2. Docker Compose Integration**

Navigate to your project directory (where `docker-compose.yml` is located) and run `up`. MirrorBox will read your file, pull all required images, and then execute the standard `docker compose up` command. Any extra arguments are passed through.
```bash
mirrorbox compose up -d --build
```

### **3. Cache Management**

**List Cached Images**
See all the images saved in the MirrorBox cache directory.
```bash
mirrorbox cache list
```

**Save an Image to Cache**
Manually save an image you already have locally to the cache.
```bash
mirrorbox cache save httpd:latest
```

**Remove an Image from Cache**
Delete one or more images from the cache to free up space.
```bash
mirrorbox cache remove httpd-latest.tar nginx-latest.tar
```

### **4. Configuration**

**View Current Settings**
See the current configuration, including the priority mirror.
```bash
mirrorbox config show
```

**Set a Priority Mirror**
Tell MirrorBox to always try a specific mirror first if it's online.
```bash
mirrorbox config set-priority focker.ir
```

**Remove the Priority Setting**
Go back to the default behavior of choosing the fastest mirror.
```bash
mirrorbox config unset-priority
```

### **5. Monitoring & Reporting**

**Show History Report**
Get a history of recent events, such as health checks and pull attempts.
```bash
mirrorbox report show --limit 15
```

**Launch Live Dashboard**
Start a live, full-screen dashboard to monitor mirror status in real-time. Press `Ctrl+C` to exit.
```bash
mirrorbox monitor start --interval 5
```
📄 License
Copyright (c) 2025 Pouya Rezapour. All Rights Reserved. See the LICENSE file for more details.

