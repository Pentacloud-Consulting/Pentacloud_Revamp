# 🚀 Pentacloud — Deployment Guide (pentacloud.me)

> Share this file to trigger a full Git → Server deployment to **https://pentacloud.me**

---

## 📦 Project Info

| Key | Value |
|-----|-------|
| **Project** | Pentacloud Consulting Website (Global / .me) |
| **Framework** | Next.js 16.2.4 (Turbopack) |
| **Repo** | `https://github.com/Pentacloud-Consulting/Pentacloud_Revamp.git` |
| **Branch** | `main` |
| **Local Path** | `c:\Users\zuhaib\OneDrive\Desktop\Office Websites\Pentacloud Consulting SEO` |

---

## 🖥️ Server Info

| Key | Value |
|-----|-------|
| **Host** | `31.97.207.239` |
| **User** | `root` |
| **Password** | `Pentacloud@2026` |
| **App Directory** | `/var/www/pentacloud` |
| **Port** | `4000` |
| **Process Manager** | PM2 (`pentacloud`, id: 25) |
| **Domain** | `https://pentacloud.me` |

> ⚠️ **DO NOT confuse with `.in` project!**
> - `.me` → `/var/www/pentacloud` → port `4000` → repo: `Pentacloud_Revamp.git`
> - `.in` → `/var/www/pentacloud-india` → port `4001` → repo: `Pentacloud_Global.git`
> - **Never deploy `.me` code to `.in` or vice versa.**

---

## ⚡ Deploy Instructions (for AI)

When the user says **"deploy"** or **"push to domain"**, follow these exact steps:

### Step 1 — Check Git Status
```powershell
git status
```

### Step 2 — Stage & Commit All Changes
```powershell
git add src/; git commit -m "feat: <describe changes here>"
```

### Step 3 — Push to GitHub
```powershell
git push origin main
```

### Step 4 — Run Deploy Script
```powershell
python deploy_now.py
```
> The script is located at the project root: `deploy_now.py`
> It handles: `git pull` → `npm install` → `npm run build` → `pm2 restart`

### Step 5 — Verify
Check that the output contains:
- ✅ `✓ Compiled successfully`
- ✅ `✓ Ready in Xms`
- ✅ `<title>Pentacloud Consulting...</title>` in the curl test

---

## 🛡️ Pre-Deploy Safety Check (IMPORTANT)

Before running `deploy_now.py`, the AI should **verify the server git remote is correct**:

```python
# Run this SSH check before deploying:
# cd /var/www/pentacloud && git remote -v
# Expected output must contain: Pentacloud_Revamp.git
# If it shows Pentacloud_Global.git → run fix_me_deploy.py first!
```

If the remote is wrong, run:
```powershell
python fix_me_deploy.py
```

---

## 🗂️ Script Locations

| Script | Purpose |
|--------|---------|
| `deploy_now.py` | Standard deploy: pull → build → restart |
| `fix_me_deploy.py` | Fix wrong git remote + full redeploy (use when server has wrong code) |
| `check_ports.py` | Verify which app is on which port |
| `check_git.py` | Inspect git remotes on server |

---

## 🌐 DNS Records (Hostinger — pentacloud.me)

| Type | Name | Value | Status |
|------|------|-------|--------|
| A | `@` | `31.97.207.239` | ✅ Set |
| A | `www` | `31.97.207.239` | ✅ Set |

> DNS is already configured correctly. No changes needed unless the server IP changes.

---

## 📋 Pages / Routes

| Route | Type |
|-------|------|
| `/` | Static |
| `/about` | Static |
| `/blogs` | Static |
| `/blogs/[slug]` | Dynamic |
| `/contact` | Static |
| `/privacy-policy` | Static |
| `/terms-of-service` | Static |
| `/services/salesforce` | Static |
| `/services/cloud` | Static |
| `/services/web` | Static |
| `/services/app` | Static |
| `/services/consulting` | Static |
| `/services/data-migration` | Static |
| `/services/digital-marketing` | Static |
| `/services/zoho` | Static |
| `/dashboard` | Static (protected) |
| `/dashboard/blogs` | Static (protected) |
| `/dashboard/blogs/[id]/edit` | Dynamic |
| `/dashboard/seo` | Static |
| `/dashboard/leads` | Static |
| `/dashboard/analytics` | Static |
| `/dashboard/media` | Static |
| `/dashboard/careers` | Static |
| `/dashboard/redirects` | Static |
| `/dashboard/sitemap` | Static |
| `/dashboard/login` | Static |
| `/api/contact` | Dynamic |
| `/api/auth/login` | Dynamic |
| `/api/blogs/get` | Dynamic |
| `/api/blogs/save` | Dynamic |
| `/api/dashboard/keywords` | Dynamic |
| `/api/dashboard/leads` | Dynamic |
| `/api/gsc` | Dynamic |
| `/api/media/list` | Dynamic |
| `/api/media/upload` | Dynamic |
| `/api/public/careers` | Dynamic |
| `/api/public/leads` | Dynamic |
| `/sitemap.xml` | Dynamic |
| `/image-sitemap.xml` | Dynamic |

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| `.me` shows `.in` project design | Run `python fix_me_deploy.py` — wrong git remote on server |
| `Failed to find Server Action` in PM2 logs | Normal after deploy — old browser tabs, clears itself |
| Build fails | Check `npm run build` output for TypeScript errors |
| App not responding | Run `pm2 restart pentacloud` manually via SSH |
| Domain still showing old site | Hard refresh `Ctrl+Shift+R` or wait for CDN cache (5–15 min) |
| `git pull` pulls wrong code | Verify remote: `git remote -v` in `/var/www/pentacloud` → must be `Pentacloud_Revamp.git` |

---

## 🔀 Two Projects on Same Server

```
Server: 31.97.207.239
│
├── /var/www/pentacloud        → port 4000 → pentacloud.me  → Pentacloud_Revamp.git  ← THIS PROJECT
└── /var/www/pentacloud-india  → port 4001 → pentacloud.in  → Pentacloud_Global.git  ← DO NOT TOUCH
```
