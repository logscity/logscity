// LogsCity Product Database
// Auto-managed by admin panel — do not edit manually

const PRODUCTS = [
  {
    id: "LC-001",
    name: "Premium Hardwood Logs",
    price: 15000,
    currency: "NGN",
    category: "Hardwood",
    description: "High-quality hardwood logs, perfect for construction and furniture making. Sourced from sustainably managed forests.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    unit: "per bundle",
    stock: "available",
    featured: true
  },
  {
    id: "LC-002",
    name: "Softwood Pine Logs",
    price: 8500,
    currency: "NGN",
    category: "Softwood",
    description: "Fresh-cut pine logs ideal for roofing, scaffolding, and light construction work.",
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600&q=80",
    unit: "per piece",
    stock: "available",
    featured: false
  },
  {
    id: "LC-003",
    name: "Treated Timber Planks",
    price: 22000,
    currency: "NGN",
    category: "Treated Wood",
    description: "Pressure-treated timber planks for outdoor use, resistant to rot, insects, and weather.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    unit: "per pack (10 planks)",
    stock: "available",
    featured: true
  },
  {
    id: "LC-004",
    name: "Firewood Bundle",
    price: 3500,
    currency: "NGN",
    category: "Firewood",
    description: "Dry and seasoned firewood, ready to burn. Excellent for cooking, heating, and outdoor fires.",
    image: "https://images.unsplash.com/photo-1445548808290-dab79c9a3bdf?w=600&q=80",
    unit: "per bundle",
    stock: "available",
    featured: false
  },
  {
    id: "LC-005",
    name: "Mahogany Logs",
    price: 45000,
    currency: "NGN",
    category: "Hardwood",
    description: "Premium mahogany logs for luxury furniture and high-end interior finishing. Rich grain, durable quality.",
    image: "https://images.unsplash.com/photo-1567361808960-dec9cb578182?w=600&q=80",
    unit: "per log",
    stock: "limited",
    featured: true
  },
  {
    id: "LC-006",
    name: "Bamboo Poles",
    price: 1200,
    currency: "NGN",
    category: "Bamboo",
    description: "Strong, lightweight bamboo poles suitable for scaffolding, fencing, and decorative projects.",
    image: "https://images.unsplash.com/photo-1610878180933-123728745d41?w=600&q=80",
    unit: "per pole",
    stock: "available",
    featured: false
  }
];

const CONTACT = {
  whatsapp: "2349131556247",
  telegram: "@Logscity855",
  telegramLink: "https://t.me/Logscity855",
  businessName: "LogsCity",
  tagline: "Premium Logs & Timber Marketplace"
};

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRODUCTS, CONTACT };
}
