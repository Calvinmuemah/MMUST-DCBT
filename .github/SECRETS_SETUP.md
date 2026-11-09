# GitHub Secrets & VPS Setup Guide (Zero-Downtime Blue-Green)

This guide documents the automated Zero-Downtime deployment architecture, GitHub Secrets, and instant rollback mechanism for MMUST DCBT on your Contabo VPS.

---

### 1. Zero-Downtime Architecture Overview

```
/var/www/mmust-dcbt/
├── releases/
│   ├── 20261103_110000/       # Prior release (kept for rollback)
│   └── 20261103_120000/       # Active release
├── current -> releases/...    # Atomic symlink (switches in 0 microseconds)
├── upstream.conf              # Upstream dynamic port (5001 or 5002)
├── rollback.sh                # Instant 1-click rollback script
└── docker-compose.yml         # Blue slot (5001) & Green slot (5002)
```

- **Frontend**: The `current` symlink switches atomically. Old releases are retained so open browser tabs never encounter `404 ChunkLoadError`.
- **Backend**: Blue-Green slots (`server_blue` on port 5001 and `server_green` on port 5002) alternate. The new container is fully healthchecked before Nginx routes traffic to it.
- **Rollback Safety**: The old container is **stopped but never deleted**. If a bug is caught post-deploy, running `bash /var/www/mmust-dcbt/rollback.sh` reverts both container and frontends in under 2 seconds.

---

### 2. Required GitHub Secrets

In GitHub: **Settings > Secrets and variables > Actions > New repository secret**:

#### Server SSH Connection
| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `VPS_HOST` | IP address of your Contabo VPS | `194.163.xxx.xxx` |
| `VPS_USERNAME` | SSH username | `root` (or `ubuntu`) |
| `VPS_SSH_KEY` | Private SSH key matching `~/.ssh/authorized_keys` | `-----BEGIN OPENSSH PRIVATE KEY...` |
| `VPS_PORT` | SSH port (Optional, defaults to 22) | `22` |

#### Application & Database Secrets
> **Security Notice**: Generate strong, random secrets using `openssl rand -hex 32`. Never copy placeholder values into production.

| Secret Name | Description | Example / Generation Command |
| :--- | :--- | :--- |
| `POSTGRES_PASSWORD` | Mandatory strong password for local PostgreSQL | `<GENERATE_RANDOM_PASSWORD_32_CHARS>` |
| `DATABASE_URL` | *(Optional)* Leave empty to use local VPS DB; or provide if using Cloud Postgres | `Leave empty for local DB` |
| `NEON_DATABASE_URL` | *(Optional)* Neon connection URL for daily offsite backup & disaster replica | `postgresql://<USER>:<PASS>@<HOST>/<DB>?sslmode=require` |
| `JWT_SECRET` | Secret key for signing tokens (minimum 32 characters) | Run: `openssl rand -hex 32` |
| `GEMINI_API_KEY` | Google Gemini AI API Key | `<YOUR_GOOGLE_GEMINI_KEY>` |
| `EMAIL_USER` | Gmail address for sending emails via Nodemailer | `<YOUR_SYSTEM_EMAIL@GMAIL.COM>` |
| `EMAIL_PASS` | 16-character Gmail App Password | `<YOUR_GMAIL_APP_PASSWORD>` |
| `ALLOWED_ORIGINS` | Comma-separated production domains allowed for CORS | `https://yourdomain.com,https://admin.yourdomain.com` |
| `VITE_API_BASE_URL` | API endpoint used by Client and Admin | `/api/v1` (or `https://api.yourdomain.com/api/v1`) |

---

### 3. One-Time Setup on Contabo VPS

SSH into your Contabo VPS:
```bash
ssh root@YOUR_VPS_IP
```

#### A. Install Docker & Nginx
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable --now docker

# Install Nginx & Certbot
sudo apt install -y nginx certbot python3-certbot-nginx
```

#### B. Setup Application Directories
```bash
sudo mkdir -p /var/www/mmust-dcbt/releases
sudo chown -R $USER:$USER /var/www/mmust-dcbt
```

#### C. Setup Nginx Virtual Host
Copy either `nginx/mmust-dcbt-subdomains.conf` or `nginx/mmust-dcbt-unified.conf` into `/etc/nginx/sites-available/mmust-dcbt.conf`.
```bash
sudo ln -sf /etc/nginx/sites-available/mmust-dcbt.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

#### D. Enable Automated Daily Neon Backup Sync (Runs at 2:00 AM)
```bash
# Add cron job to sync local database to Neon every day at 2:00 AM
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/mmust-dcbt/scripts/sync_to_neon.sh >> /var/log/mmust_neon_sync.log 2>&1") | crontab -
```

---

### 4. How to Trigger Rollback (If Ever Needed)

If an issue occurs after a deployment, run this single command on the VPS:
```bash
bash /var/www/mmust-dcbt/rollback.sh
```
What it does:
1. Re-starts the previous standby container.
2. Verifies health.
3. Points Nginx upstream back to the old slot.
4. Switches the `current` symlink to the previous frontend release.
5. Gracefully reloads Nginx.
Total time: **~1.5 seconds**, with zero downtime.
