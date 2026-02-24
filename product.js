// LogsCity Social Media Accounts Database
// Auto-managed by admin panel — do not edit manually

const PRODUCTS = [
  {
    id: "LC-001",
    name: "Instagram Aged Account",
    price: 12000,
    currency: "NGN",
    category: "Instagram",
    description: "Premium aged Instagram account with real followers. Verified email included. Ready for immediate use.",
    image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=600&q=80",
    unit: "per account",
    followers: "5K–10K",
    accountAge: "2 years",
    stock: "available",
    featured: true
  },
  {
    id: "LC-002",
    name: "Facebook Business Account",
    price: 8500,
    currency: "NGN",
    category: "Facebook",
    description: "Aged Facebook account with business page access. Clean history, verified identity, perfect for ads.",
    image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&q=80",
    unit: "per account",
    followers: "1K–3K",
    accountAge: "3 years",
    stock: "available",
    featured: false
  },
  {
    id: "LC-003",
    name: "TikTok Creator Account",
    price: 15000,
    currency: "NGN",
    category: "TikTok",
    description: "High-engagement TikTok account with genuine following. Monetization eligible. Original login credentials.",
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    unit: "per account",
    followers: "10K–50K",
    accountAge: "1.5 years",
    stock: "available",
    featured: true
  },
  {
    id: "LC-004",
    name: "Twitter/X Verified Account",
    price: 25000,
    currency: "NGN",
    category: "Twitter",
    description: "Aged Twitter/X account with established presence. Blue tick eligible. Original email and credentials.",
    image: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&q=80",
    unit: "per account",
    followers: "2K–8K",
    accountAge: "4 years",
    stock: "limited",
    featured: true
  },
  {
    id: "LC-005",
    name: "Telegram Channel",
    price: 18000,
    currency: "NGN",
    category: "Telegram",
    description: "Active Telegram channel with real subscribers. Niche-ready, high open rates. Full admin access transferred.",
    image: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&q=80",
    unit: "per channel",
    followers: "3K–15K",
    accountAge: "2 years",
    stock: "available",
    featured: false
  },
  {
    id: "LC-006",
    name: "YouTube Monetized Channel",
    price: 45000,
    currency: "NGN",
    category: "YouTube",
    description: "Fully monetized YouTube channel meeting all Partner Program requirements. Includes AdSense account.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80",
    unit: "per channel",
    followers: "1K+ subs",
    accountAge: "3 years",
    stock: "limited",
    featured: true
  }
];

const CONTACT = {
  whatsapp: "2349131556247",
  telegram: "@Logscity855",
  telegramLink: "https://t.me/Logscity855",
  businessName: "LogsCity",
  tagline: "Nigeria's Trusted Social Media Accounts Marketplace"
};

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, CONTACT };
}
