# 🪵 LogsCity Marketplace — Setup Guide

## Repository Structure

You need **TWO repositories** on GitHub:

### Repo 1: Frontend (index.html + admin.html + product.js)
```
logscity-frontend/
├── index.html      ← Customer storefront
├── admin.html      ← Admin portal
└── product.js      ← Product & contact database (auto-edited by server)
```

### Repo 2: Backend (server.js — deploy this on Render)
```
logscity-server/
├── server.js
└── package.json
```

---

## Step-by-Step Deployment

### 1. Frontend Repo Setup
1. Create a new GitHub repo called `logscity-frontend`
2. Upload `index.html`, `admin.html`, and `product.js`
3. Enable **GitHub Pages** (Settings → Pages → Deploy from main branch)
4. Note your site URL: `https://yourusername.github.io/logscity-frontend`

### 2. GitHub Token Setup
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Name: `logscity-server`
4. Scopes: Check **repo** (full control)
5. Click Generate and **copy the token** — save it!

### 3. Server Repo Setup
1. Create a new GitHub repo called `logscity-server`
2. Upload `server.js` and `package.json`

### 4. Deploy on Render
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your `logscity-server` repo
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Runtime:** Node

4. Add **Environment Variables** in Render dashboard:

| Variable | Value |
|----------|-------|
| `ADMIN_PASSWORD` | Your chosen admin password |
| `GITHUB_TOKEN` | The token you generated above |
| `GITHUB_OWNER` | Your GitHub username |
| `GITHUB_REPO` | `logscity-frontend` |
| `GITHUB_FILE_PATH` | `product.js` |
| `JWT_SECRET` | Any random long string (e.g. `logscity-super-secret-2024-xyz`) |
| `ALLOWED_ORIGIN` | `https://yourusername.github.io` |

5. Click **Deploy** and wait for it to go live
6. Copy your Render URL (e.g. `https://logscity-server.onrender.com`)

### 5. Connect Frontend to Server
Update the SERVER variable in both `index.html` and `admin.html`:
```js
const SERVER = 'https://logscity-server.onrender.com'; // Your Render URL
```

---

## How It Works

```
Customer visits index.html
  → Fetches products from server → server reads product.js on GitHub
  → Customer clicks Buy → Opens WhatsApp/Telegram with product details

Admin visits admin.html
  → Enters password → Server verifies → Issues JWT token
  → Admin adds/edits/deletes product → Server updates product.js on GitHub
  → index.html auto-shows updated products
```

## WhatsApp Order Format (sent automatically)
```
Hello LogsCity! 🪵

I want to order:
📦 Product: Premium Hardwood Logs
🆔 ID: LC-001
💰 Price: ₦15,000 per bundle
📂 Category: Hardwood

Please confirm availability and delivery details. Thank you!
```

---

## Security Notes
- Admin password is stored only in Render environment (never in code)
- GitHub token is stored only in Render environment (never in code)
- JWT tokens expire after 8 hours
- All inputs are sanitized before saving to GitHub
- CORS is restricted to your frontend domain
