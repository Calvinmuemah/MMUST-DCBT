# MMUST DCBT - Nginx Configuration Guide

This directory provides two production-grade Nginx configurations:

1. **`mmust-dcbt-subdomains.conf` (Recommended for Domains)**:
   - `yourdomain.com`: Student portal & landing page
   - `admin.yourdomain.com`: Administrative dashboard
   - `api.yourdomain.com`: Express backend API

2. **`mmust-dcbt-unified.conf` (Recommended for Single Domain or Direct VPS IP)**:
   - `/`: Student portal & landing page
   - `/admin`: Administrative dashboard
   - `/api/`: Express backend API

---

### Step-by-Step Installation on VPS (Ubuntu / Debian)

#### 1. Install Nginx & Certbot
```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
```

#### 2. Configure Domain & Copy Configuration
You can automatically replace domain placeholders and update CSP directives using:
```bash
bash scripts/configure-domains.sh yourregistereddomain.com
```

Or manually choose either `mmust-dcbt-subdomains.conf` or `mmust-dcbt-unified.conf` and copy it to `/etc/nginx/sites-available/`:
```bash
sudo cp mmust-dcbt-subdomains.conf /etc/nginx/sites-available/mmust-dcbt.conf
```
*(If editing manually, replace `yourdomain.com` with your actual domain name. If using `mmust-dcbt-subdomains.conf`, ensure `https://api.yourdomain.com` in the `Content-Security-Policy` header matches your real API domain. If using `mmust-dcbt-unified.conf`, `connect-src 'self'` works automatically on the same origin).*

#### 3. Enable the Site
```bash
sudo ln -sf /etc/nginx/sites-available/mmust-dcbt.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
```

#### 4. Test & Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. Obtain Free SSL with Certbot
```bash
sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com -d api.yourdomain.com
```
Certbot will automatically obtain certificates and configure HTTPS redirects.
