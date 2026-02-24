/**
 * LogsCity Marketplace Server
 * Deploy this on Render.com
 *
 * Required Environment Variables on Render:
 *   ADMIN_PASSWORD   — your admin panel password
 *   GITHUB_TOKEN     — GitHub personal access token (repo scope)
 *   GITHUB_OWNER     — your GitHub username or org
 *   GITHUB_REPO      — repository where product.js lives (frontend repo)
 *   GITHUB_FILE_PATH — path to product.js in the repo (default: product.js)
 *   JWT_SECRET       — a random secret string for JWT signing
 *   ALLOWED_ORIGIN   — your frontend URL e.g. https://yourdomain.com (or *)
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Octokit } = require('@octokit/rest');

const app = express();
const PORT = process.env.PORT || 3000;

// ── ENV CONFIG ──────────────────────────────────────────────
const ADMIN_PASSWORD   = process.env.ADMIN_PASSWORD;
const GITHUB_TOKEN     = process.env.GITHUB_TOKEN;
const GITHUB_OWNER     = process.env.GITHUB_OWNER;
const GITHUB_REPO      = process.env.GITHUB_REPO;
const GITHUB_FILE_PATH = process.env.GITHUB_FILE_PATH || 'product.js';
const JWT_SECRET       = process.env.JWT_SECRET || 'change-me-in-production';
const ALLOWED_ORIGIN   = process.env.ALLOWED_ORIGIN || '*';

// Validate required env vars on startup
const required = ['ADMIN_PASSWORD', 'GITHUB_TOKEN', 'GITHUB_OWNER', 'GITHUB_REPO'];
required.forEach(key => {
  if (!process.env[key]) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

const octokit = new Octokit({ auth: GITHUB_TOKEN });

// ── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

// ── AUTH MIDDLEWARE ──────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = auth.slice(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── ID GENERATOR ─────────────────────────────────────────────
function generateId(products) {
  let num = products.length + 1;
  let id;
  do {
    id = `LC-${String(num).padStart(3, '0')}`;
    num++;
  } while (products.find(p => p.id === id));
  return id;
}

// ── GITHUB HELPERS ────────────────────────────────────────────
async function fetchProductFile() {
  const { data } = await octokit.repos.getContent({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: GITHUB_FILE_PATH,
  });
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  return { content, sha: data.sha };
}

function parseProductsFromContent(content) {
  // Extract PRODUCTS array from product.js
  const productsMatch = content.match(/const PRODUCTS\s*=\s*(\[[\s\S]*?\]);/);
  const contactMatch  = content.match(/const CONTACT\s*=\s*(\{[\s\S]*?\});/);

  let products = [], contact = {};
  try { if (productsMatch) products = JSON.parse(productsMatch[1]); } catch (e) {
    console.error('Failed to parse PRODUCTS:', e.message);
  }
  try { if (contactMatch) contact = JSON.parse(contactMatch[1]); } catch (e) {
    console.error('Failed to parse CONTACT:', e.message);
  }
  return { products, contact };
}

function buildProductFileContent(products, contact) {
  return `// LogsCity Product Database
// Auto-managed by admin panel — do not edit manually

const PRODUCTS = ${JSON.stringify(products, null, 2)};

const CONTACT = ${JSON.stringify(contact, null, 2)};

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, CONTACT };
}
`;
}

async function saveToGitHub(newContent, sha, message) {
  await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: GITHUB_FILE_PATH,
    message,
    content: Buffer.from(newContent).toString('base64'),
    sha,
  });
}

// ── ROUTES ────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => res.json({ status: 'LogsCity API running 🪵', version: '1.0.0' }));

// ── AUTH: Login
app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

// ── GET: All products and contact (public — for storefront)
app.get('/api/products', async (req, res) => {
  try {
    const { content } = await fetchProductFile();
    const { products, contact } = parseProductsFromContent(content);
    res.json({ products, contact });
  } catch (err) {
    console.error('GET /api/products error:', err.message);
    res.status(500).json({ error: 'Failed to fetch products from GitHub' });
  }
});

// ── POST: Add new product (protected)
app.post('/api/products', requireAuth, async (req, res) => {
  try {
    const { content, sha } = await fetchProductFile();
    const { products, contact } = parseProductsFromContent(content);

    const body = req.body;
    if (!body.name || !body.category || body.price === undefined || !body.unit || !body.stock || !body.description || !body.image) {
      return res.status(400).json({ error: 'Missing required product fields' });
    }

    // Sanitize and build new product
    const newProduct = {
      id: generateId(products),
      name: sanitize(body.name),
      price: Math.abs(Number(body.price)),
      currency: 'NGN',
      category: sanitize(body.category),
      description: sanitize(body.description),
      image: sanitizeUrl(body.image),
      unit: sanitize(body.unit),
      stock: ['available', 'limited', 'out'].includes(body.stock) ? body.stock : 'available',
      featured: body.featured === true || body.featured === 'true',
    };

    products.push(newProduct);
    const newContent = buildProductFileContent(products, contact);
    await saveToGitHub(newContent, sha, `Add product: ${newProduct.name} [${newProduct.id}]`);

    res.json({ success: true, product: newProduct });
  } catch (err) {
    console.error('POST /api/products error:', err.message);
    res.status(500).json({ error: 'Failed to add product: ' + err.message });
  }
});

// ── PUT: Update product (protected)
app.put('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, sha } = await fetchProductFile();
    const { products, contact } = parseProductsFromContent(content);

    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const body = req.body;
    products[idx] = {
      ...products[idx],
      name:        body.name        ? sanitize(body.name)         : products[idx].name,
      price:       body.price !== undefined ? Math.abs(Number(body.price)) : products[idx].price,
      category:    body.category    ? sanitize(body.category)     : products[idx].category,
      description: body.description ? sanitize(body.description)  : products[idx].description,
      image:       body.image       ? sanitizeUrl(body.image)      : products[idx].image,
      unit:        body.unit        ? sanitize(body.unit)          : products[idx].unit,
      stock:       ['available','limited','out'].includes(body.stock) ? body.stock : products[idx].stock,
      featured:    body.featured !== undefined ? (body.featured === true || body.featured === 'true') : products[idx].featured,
    };

    const newContent = buildProductFileContent(products, contact);
    await saveToGitHub(newContent, sha, `Update product: ${products[idx].name} [${id}]`);
    res.json({ success: true, product: products[idx] });
  } catch (err) {
    console.error('PUT /api/products error:', err.message);
    res.status(500).json({ error: 'Failed to update product: ' + err.message });
  }
});

// ── DELETE: Remove product (protected)
app.delete('/api/products/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, sha } = await fetchProductFile();
    const { products, contact } = parseProductsFromContent(content);

    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Product not found' });

    const removed = products.splice(idx, 1)[0];
    const newContent = buildProductFileContent(products, contact);
    await saveToGitHub(newContent, sha, `Delete product: ${removed.name} [${id}]`);
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products error:', err.message);
    res.status(500).json({ error: 'Failed to delete product: ' + err.message });
  }
});

// ── PUT: Update contact info (protected)
app.put('/api/contact', requireAuth, async (req, res) => {
  try {
    const { content, sha } = await fetchProductFile();
    const { products } = parseProductsFromContent(content);

    const body = req.body;
    if (!body.whatsapp || !body.telegram || !body.telegramLink || !body.businessName) {
      return res.status(400).json({ error: 'Missing required contact fields' });
    }
    if (!/^\d{10,15}$/.test(body.whatsapp)) {
      return res.status(400).json({ error: 'WhatsApp must be digits only, 10-15 characters' });
    }
    if (!/^@\w{3,}$/.test(body.telegram)) {
      return res.status(400).json({ error: 'Telegram must start with @ and be 3+ characters' });
    }
    if (!/^https:\/\/t\.me\/.+/.test(body.telegramLink)) {
      return res.status(400).json({ error: 'Telegram link must be https://t.me/...' });
    }

    const newContact = {
      whatsapp:     sanitize(body.whatsapp),
      telegram:     sanitize(body.telegram),
      telegramLink: sanitizeUrl(body.telegramLink),
      businessName: sanitize(body.businessName),
      tagline:      body.tagline ? sanitize(body.tagline) : '',
    };

    const newContent = buildProductFileContent(products, newContact);
    await saveToGitHub(newContent, sha, 'Update contact details');
    res.json({ success: true, contact: newContact });
  } catch (err) {
    console.error('PUT /api/contact error:', err.message);
    res.status(500).json({ error: 'Failed to update contact: ' + err.message });
  }
});

// ── SANITIZE HELPERS ─────────────────────────────────────────
function sanitize(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/[<>"'`]/g, '').trim().slice(0, 500);
}
function sanitizeUrl(url) {
  if (typeof url !== 'string') return '';
  const u = url.trim();
  if (!/^https?:\/\/.+/.test(u)) return '';
  return u.replace(/[<>"'`]/g, '').slice(0, 1000);
}

// ── START ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🪵 LogsCity Server running on port ${PORT}`);
  console.log(`   GitHub: ${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_FILE_PATH}`);
});
