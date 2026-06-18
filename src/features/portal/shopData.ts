export type Product = {
  id: string;
  name: string;
  tagline: string;
  category: "Supplements" | "Skincare" | "Peptides" | "Devices" | "Apparel";
  price: number;
  memberPrice: number;
  rx: boolean;
  inStock: boolean;
  rating: number;
  reviews: number;
  gradient: string;
  badge?: string;
  overview: string;
  ingredients: string[];
  howTo: string;
  subscribable: boolean;
};

export const products: Product[] = [
  {
    id: "vit-d3",
    name: "Vitamin D3 + K2",
    tagline: "5,000 IU · 90 softgels",
    category: "Supplements",
    price: 32,
    memberPrice: 27.2,
    rx: false,
    inStock: true,
    rating: 4.8,
    reviews: 412,
    gradient: "from-amber-300 to-orange-500",
    badge: "Best seller",
    overview: "Pharmaceutical-grade D3 paired with K2 (MK-7) for optimal calcium handling and immune support.",
    ingredients: ["Vitamin D3 (cholecalciferol) 5,000 IU", "Vitamin K2 (MK-7) 90 mcg", "MCT oil", "Gelatin softgel"],
    howTo: "Take 1 softgel daily with a meal containing fat.",
    subscribable: true,
  },
  {
    id: "mag-glycinate",
    name: "Magnesium Glycinate",
    tagline: "400 mg · 120 capsules",
    category: "Supplements",
    price: 28,
    memberPrice: 23.8,
    rx: false,
    inStock: true,
    rating: 4.9,
    reviews: 286,
    gradient: "from-emerald-300 to-teal-600",
    overview: "Highly bioavailable chelated magnesium for sleep, muscle recovery, and stress response.",
    ingredients: ["Magnesium glycinate 400 mg", "Vegetable cellulose capsule"],
    howTo: "Take 2 capsules 30 minutes before bed.",
    subscribable: true,
  },
  {
    id: "b-complex",
    name: "Methylated B-Complex",
    tagline: "60 capsules",
    category: "Supplements",
    price: 36,
    memberPrice: 30.6,
    rx: false,
    inStock: true,
    rating: 4.7,
    reviews: 191,
    gradient: "from-rose-300 to-pink-600",
    overview: "Active forms of B vitamins including methylfolate and methylcobalamin.",
    ingredients: ["Methylfolate", "Methylcobalamin B12", "P-5-P B6", "Riboflavin-5-phosphate"],
    howTo: "1 capsule daily with breakfast.",
    subscribable: true,
  },
  {
    id: "omega3",
    name: "Triglyceride Omega-3",
    tagline: "2,400 mg EPA/DHA · 60 softgels",
    category: "Supplements",
    price: 44,
    memberPrice: 37.4,
    rx: false,
    inStock: true,
    rating: 4.9,
    reviews: 523,
    gradient: "from-sky-300 to-cyan-600",
    badge: "Bundle",
    overview: "Ultra-pure, third-party tested fish oil in natural triglyceride form for max absorption.",
    ingredients: ["EPA 1,440 mg", "DHA 960 mg", "Mixed tocopherols", "Lemon oil"],
    howTo: "2 softgels daily with food.",
    subscribable: true,
  },
  {
    id: "retinol",
    name: "Clinical Retinol 0.5%",
    tagline: "Encapsulated · 30 mL",
    category: "Skincare",
    price: 78,
    memberPrice: 66.3,
    rx: false,
    inStock: true,
    rating: 4.8,
    reviews: 342,
    gradient: "from-violet-300 to-fuchsia-600",
    overview: "Time-released retinol with niacinamide to smooth tone, texture, and fine lines.",
    ingredients: ["Encapsulated retinol 0.5%", "Niacinamide 4%", "Squalane", "Bisabolol"],
    howTo: "PM only. Pea-sized amount, 2–3 nights per week, build to nightly.",
    subscribable: true,
  },
  {
    id: "vit-c",
    name: "Vitamin C 15% Serum",
    tagline: "L-ascorbic acid · 30 mL",
    category: "Skincare",
    price: 88,
    memberPrice: 74.8,
    rx: false,
    inStock: true,
    rating: 4.9,
    reviews: 218,
    gradient: "from-yellow-300 to-amber-600",
    overview: "Stabilized L-ascorbic acid with ferulic acid + vitamin E for brightening and photoprotection.",
    ingredients: ["L-ascorbic acid 15%", "Ferulic acid 0.5%", "Vitamin E 1%"],
    howTo: "AM. 4–5 drops to clean skin before SPF.",
    subscribable: true,
  },
  {
    id: "spf",
    name: "Tinted Mineral SPF 40",
    tagline: "Universal tint · 50 mL",
    category: "Skincare",
    price: 56,
    memberPrice: 47.6,
    rx: false,
    inStock: true,
    rating: 4.7,
    reviews: 401,
    gradient: "from-stone-300 to-amber-500",
    overview: "Zinc-based mineral SPF with a universal tint and silky finish.",
    ingredients: ["Zinc oxide 18%", "Iron oxides", "Niacinamide", "Hyaluronic acid"],
    howTo: "AM, last step. Reapply every 2 hours of sun exposure.",
    subscribable: false,
  },
  {
    id: "semaglutide",
    name: "Compounded Semaglutide",
    tagline: "Monthly supply · 0.25–2.4 mg titration",
    category: "Peptides",
    price: 349,
    memberPrice: 296.65,
    rx: true,
    inStock: true,
    rating: 4.9,
    reviews: 612,
    gradient: "from-teal-400 to-emerald-600",
    badge: "Rx required",
    overview: "GLP-1 receptor agonist for weight management. Requires active prescription from your provider.",
    ingredients: ["Semaglutide (compounded)", "Bacteriostatic water", "Methylcobalamin (optional B12)"],
    howTo: "Weekly subcutaneous injection per your titration schedule.",
    subscribable: true,
  },
  {
    id: "tirz",
    name: "Compounded Tirzepatide",
    tagline: "Monthly supply · 2.5–15 mg titration",
    category: "Peptides",
    price: 499,
    memberPrice: 424.15,
    rx: true,
    inStock: true,
    rating: 4.9,
    reviews: 287,
    gradient: "from-indigo-400 to-violet-700",
    badge: "Rx required",
    overview: "Dual GIP/GLP-1 agonist for metabolic and weight outcomes. Requires active prescription.",
    ingredients: ["Tirzepatide (compounded)", "Bacteriostatic water"],
    howTo: "Weekly subcutaneous injection per your titration schedule.",
    subscribable: true,
  },
  {
    id: "scale",
    name: "Smart Body Composition Scale",
    tagline: "Wi-Fi · syncs with portal",
    category: "Devices",
    price: 199,
    memberPrice: 169.15,
    rx: false,
    inStock: true,
    rating: 4.6,
    reviews: 174,
    gradient: "from-slate-400 to-zinc-700",
    overview: "Tracks weight, body fat, muscle mass, and visceral fat. Auto-syncs to your Progress page.",
    ingredients: ["Glass + aluminum", "Bioimpedance sensors", "Wi-Fi 2.4 GHz"],
    howTo: "Step on barefoot, same time daily — morning works best.",
    subscribable: false,
  },
  {
    id: "ring",
    name: "Recovery Ring · Gen 4",
    tagline: "Sleep, HRV, readiness",
    category: "Devices",
    price: 329,
    memberPrice: 279.65,
    rx: false,
    inStock: false,
    rating: 4.7,
    reviews: 88,
    gradient: "from-zinc-700 to-slate-900",
    overview: "Continuous biometrics for sleep stages, HRV, and recovery. Pairs with ARCA Rx.",
    ingredients: ["Titanium shell", "Infrared + green LED", "Skin temp sensor"],
    howTo: "Wear 24/7. Charge ~30 min every 5–7 days.",
    subscribable: false,
  },
  {
    id: "tee",
    name: "ARCA Rx Performance Tee",
    tagline: "Pima cotton · unisex",
    category: "Apparel",
    price: 38,
    memberPrice: 32.3,
    rx: false,
    inStock: true,
    rating: 4.5,
    reviews: 64,
    gradient: "from-neutral-300 to-neutral-600",
    overview: "Soft-hand pima cotton tee with embroidered mark.",
    ingredients: ["100% pima cotton"],
    howTo: "Machine wash cold, tumble dry low.",
    subscribable: false,
  },
];

export const categories = ["All", "Supplements", "Skincare", "Peptides", "Devices", "Apparel"] as const;
export type Category = (typeof categories)[number];

export type OrderStatus = "processing" | "shipped" | "delivered";
export type Order = {
  id: string;
  placed: string;
  status: OrderStatus;
  total: number;
  tracking?: string;
  eta?: string;
  items: { productId: string; qty: number; price: number }[];
};

export const pastOrders: Order[] = [
  {
    id: "ORD-10241",
    placed: "May 28, 2026",
    status: "delivered",
    total: 116.6,
    tracking: "1Z999AA10123456784",
    items: [
      { productId: "vit-d3", qty: 1, price: 27.2 },
      { productId: "omega3", qty: 1, price: 37.4 },
      { productId: "mag-glycinate", qty: 2, price: 23.8 },
    ],
  },
  {
    id: "ORD-10198",
    placed: "May 8, 2026",
    status: "shipped",
    total: 296.65,
    tracking: "1Z999AA10123456221",
    eta: "Arrives Jun 11",
    items: [{ productId: "semaglutide", qty: 1, price: 296.65 }],
  },
  {
    id: "ORD-10162",
    placed: "Apr 14, 2026",
    status: "delivered",
    total: 141.1,
    tracking: "1Z999AA10123455891",
    items: [
      { productId: "retinol", qty: 1, price: 66.3 },
      { productId: "vit-c", qty: 1, price: 74.8 },
    ],
  },
];
