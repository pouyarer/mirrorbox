<div align="center">

<img src="frontend/src/assets/logo.png" alt="MirrorBox Logo" width="200" height="200" />

# MirrorBox v2 🚀
### Enterprise Docker Gateway & Anti-Sanction Toolkit

**Bypass 403 Errors | Smart Caching | High-Speed Mirrors**

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Docker](https://img.shields.io/badge/Docker-Compatible-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Stable-brightgreen?style=for-the-badge)]()

</div>

---

## 📖 Introduction

**MirrorBox** is not just a proxy; it's a **Smart Wrapper** around Docker designed specifically for restricted environments. 

It intelligently intercepts your Docker commands, routing traffic through the fastest available high-speed mirrors to bypass sanctions (403 Forbidden). With **MirrorBox v2**, you get a modern GUI, real-time telemetry, and an advanced **Offline Cache System** that ensures you never have to download the same image twice.

Stop fighting with VPNs and DNS settings. Let **MirrorBox** handle the traffic while you focus on coding.

---

## ✨ Key Features

### 📦 Intelligent Local Caching (Offline Mode)
MirrorBox automatically saves every pulled image as a portable archive on your disk.
* **Save Bandwidth:** Internet cut off? No problem. MirrorBox loads the image from your local cache instantly.
* **Portable:** Easily transfer your cached images between machines.
* **Zero Latency:** Loading from disk is faster than any gigabit internet connection.

### 🚀 Smart Proxy Engine
Simply replace `docker` with `mirrorbox` in your terminal. The engine automatically:
1.  Checks available mirrors (ArvanCloud, Focker).
2.  Selects the fastest one based on real-time ping.
3.  Injects the mirror URL seamlessly while preserving all your original flags (`-d`, `-p`, `-v`).

### 🛡️ System-Wide Configuration
For servers and CI/CD pipelines, MirrorBox can configure your Docker Daemon directly, applying **Registry Mirrors** 

### 📊 Modern GUI Dashboard
A beautiful, glassmorphism-based interface to manage your images, monitor network health, and visualize your cache.

<div align="center">
  <img src="assets/MirrorBox.png" alt="MirrorBox Dashboard" width="100%" style="border-radius: 10px; border: 1px solid #333;" />
</div>

---

## 📦 Installation & Quick Start

MirrorBox requires **Python 3.10+**.
It is strongly recommended to install it inside a **virtual environment** to avoid conflicts with system packages.

### 1️⃣ Create a Virtual Environment
```bash
python3 -m venv venv

```

### 2️⃣ Activate the Environment

```bash
# Linux / macOS
source venv/bin/activate 

# Windows
venv\Scripts\activate.bat 

```

### 3️⃣ Install MirrorBox

```bash
pip install --upgrade mirrorbox

```

---

## 🖥️ Graphical Interface

For a visual experience, launch the modern desktop dashboard:

```bash
mirrorbox open

```

This will launch the **MirrorBox Control Center**, where you can:

* Monitor Real-Time Network Latency.
* Search for images across all mirrors.
* Manage your Local Cache files.
* Run Docker Compose projects with one click.

---

## 🛠️ CLI Reference (The Power of Terminal)

MirrorBox CLI is a hybrid tool. It has its own management commands, but it also acts as a **full proxy for Docker**.

### 1. MirrorBox Management Commands

| Command | Description |
| --- | --- |
| `mirrorbox open` | Launches the GUI Dashboard. |
| `mirrorbox search <name>` | Searches for an image across all available mirrors to find the best source. |
| `mirrorbox setup` | **(Root/Admin)** Configures `/etc/docker/daemon.json` with Mirrors & DNS. Recommended for Servers. |
| `mirrorbox unsetup` | Restores the original Docker configuration. |
| `mirrorbox compose <cmd>` | A wrapper for `docker-compose`. Example: `mirrorbox compose up -d`. |
| `mirrorbox help` | Shows the beautiful interactive documentation. |

### 2. Docker Proxy Commands (Smart Passthrough)

You can use **ANY** standard Docker command with MirrorBox. It will intelligently handle image pulls and pass everything else to the Docker Daemon.

#### ⬇️ Pulling Images (Accelerated)

```bash
# Automatically finds the fastest mirror
mirrorbox pull nginx:latest
mirrorbox pull ubuntu:22.04

```

#### 🏃 Running Containers

MirrorBox intercepts the image name, redirects it to a mirror, but keeps ALL your flags intact.

```bash
# Standard usage
mirrorbox run -d -p 8080:80 nginx

# Complex usage with Volumes and Env Vars
mirrorbox run -it --rm -v $(pwd):/app -e DEBUG=true python:3.9-alpine sh

```

#### 📋 Managing Containers (Passthrough)

These commands work exactly like standard Docker:

```bash
# List containers
mirrorbox ps -a

# View logs
mirrorbox logs -f my-container

# Stop/Remove
mirrorbox stop my-container
mirrorbox rm my-container

# System Prune
mirrorbox system prune -f

```

---

## ❤️ Support the Development

Building enterprise-grade tools requires coffee and dedication. If MirrorBox saved your time, consider supporting the project:

### [💎 Donate & Support](https://pay.oxapay.com/14009511)

<div align="center">
<sub>Powered by <b>Testeto</b> | Developed by <a href="https://pouyarezapour.ir"><b>Pouya Rezapour</b></a></sub>
</div>
