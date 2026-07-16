# 🚀 Pentacloud Consulting — Deployment Guide

## Server Details

| Field        | Value                          |
|--------------|--------------------------------|
| **Domain**   | https://pentacloud.me          |
| **VPS IP**   | 31.97.207.239                  |
| **User**     | root                           |
| **Password** | Pentacloud@2026                |
| **App Dir**  | /var/www/pentacloud            |
| **Port**     | 4000 (Next.js)                 |
| **PM2 Name** | pentacloud                     |
| **GitHub**   | https://github.com/Pentacloud-Consulting/Pentacloud_Revamp |

---

## ⚡ Quick Deploy (Every Time You Make Changes)

### Step 1 — Push your changes to GitHub
```bash
git add .
git commit -m "your message here"
git push origin main
```

### Step 2 — Run the deploy script
```bash
python deploy_to_vps.py
```

> This will SSH into the VPS, pull latest code, rebuild, and restart the app automatically.

---

## 📄 Deploy Script (`deploy_to_vps.py`)

Create this file in the project root when needed and run it:

```python
import paramiko
import sys
import io

HOST = "31.97.207.239"
USER = "root"
PASS = "Pentacloud@2026"
APP_DIR = "/var/www/pentacloud"
BRANCH = "main"

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

def run(client, cmd, timeout=300):
    print(f"\n$ {cmd}", flush=True)
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    if out: print(out, flush=True)
    if err: print(f"[STDERR] {err}", file=sys.stderr, flush=True)
    return out, err

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
print(f"Connecting to {HOST}...", flush=True)
client.connect(HOST, username=USER, password=PASS, timeout=15)
print("Connected!", flush=True)

# Pull latest from GitHub
run(client, f"cd {APP_DIR} && git fetch origin && git reset --hard origin/{BRANCH}")

# Install dependencies
run(client, f"cd {APP_DIR} && npm install --legacy-peer-deps", timeout=300)

# Build Next.js
run(client, f"cd {APP_DIR} && npm run build 2>&1", timeout=600)

# Restart PM2
run(client, "pm2 restart pentacloud")
run(client, "pm2 save")

# Verify
run(client, "pm2 status")
run(client, "curl -s -o /dev/null -w 'Status: %{http_code}' http://localhost:4000")

print("\n✅ Deployment complete! Visit: https://pentacloud.me", flush=True)
client.close()
```

### Install Paramiko (only once):
```bash
pip install paramiko
```

---

## 🔧 Manual SSH Commands (if needed)

SSH into the server:
```bash
ssh root@31.97.207.239
# Password: Pentacloud@2026
```

Once inside:
```bash
# Pull latest code
cd /var/www/pentacloud
git pull origin main

# Rebuild
npm install --legacy-peer-deps
npm run build

# Restart app
pm2 restart pentacloud
pm2 save

# Check status
pm2 status
pm2 logs pentacloud --lines 50
```

---

## 🌐 Nginx Config Location

```
/etc/nginx/sites-available/pentacloud
```

Current config proxies `pentacloud.me → localhost:4000`

To reload Nginx after any config change:
```bash
nginx -t && systemctl reload nginx
```

---

## 🔒 SSL / HTTPS Setup (one-time)

To enable HTTPS on the domain:
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d pentacloud.me -d www.pentacloud.me
```

---

## 📋 PM2 Cheat Sheet

| Command | Description |
|---------|-------------|
| `pm2 status` | View all running apps |
| `pm2 restart pentacloud` | Restart the site |
| `pm2 logs pentacloud` | View live logs |
| `pm2 logs pentacloud --lines 100` | View last 100 log lines |
| `pm2 stop pentacloud` | Stop the site |
| `pm2 delete pentacloud` | Remove from PM2 |

---

## ✅ Full Workflow Summary

```
Edit code locally
    ↓
git add . && git commit -m "..." && git push origin main
    ↓
python deploy_to_vps.py
    ↓
Site live at https://pentacloud.me 🎉
```
