import { useState, useEffect } from "react";

// ─── STORAGE HELPERS (localStorage) ──────────────────────────────────────────
const store = {
  async get(key, def) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : def;
    } catch { return def; }
  },
  async set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }
};

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_OUTLETS = [
  { id: "kopken", name: "Kopi Kenangan", emoji: "☕", color: "#d62828" },
];

const INIT_CATALOG = [
  // ── Non Coffee ──
  { id:1, outletId:"kopken", name:"Avocado Caramel", cat:"Non Coffee", r:17500, l:22500, outlet:28000, emoji:"🥑" },
  { id:2, outletId:"kopken", name:"Avocado Milk", cat:"Non Coffee", r:15500, l:20500, outlet:24000, emoji:"🥑" },
  { id:3, outletId:"kopken", name:"Toffee Nut Choco Macadamia", cat:"Non Coffee", r:14500, l:null, outlet:22000, emoji:"🍫" },
  { id:4, outletId:"kopken", name:"Butterscotch Sea Salt", cat:"Non Coffee", r:14500, l:null, outlet:22000, emoji:"🧋" },
  { id:5, outletId:"kopken", name:"Milk Oreo Crumble", cat:"Non Coffee", r:16500, l:null, outlet:26000, emoji:"🍪" },
  { id:6, outletId:"kopken", name:"Babyccino", cat:"Non Coffee", r:13000, l:null, outlet:19000, emoji:"🍼" },
  { id:7, outletId:"kopken", name:"Caramel Dutch Choco", cat:"Non Coffee", r:17500, l:22500, outlet:28000, emoji:"🍫" },
  { id:8, outletId:"kopken", name:"Dutch Chocolate", cat:"Non Coffee", r:16500, l:21500, outlet:26000, emoji:"🍫" },
  { id:9, outletId:"kopken", name:"Dubai Pistachio Chocolate", cat:"Non Coffee", r:17000, l:22000, outlet:27000, emoji:"🌿" },
  { id:10, outletId:"kopken", name:"Hazelnut Choco Milk Tea", cat:"Non Coffee", r:14500, l:19500, outlet:22000, emoji:"🌰" },
  { id:11, outletId:"kopken", name:"Hazelnut Dutch Choco", cat:"Non Coffee", r:17500, l:22500, outlet:28000, emoji:"🌰" },
  { id:12, outletId:"kopken", name:"Lemon Black Tea", cat:"Non Coffee", r:12000, l:17000, outlet:17000, emoji:"🍋" },
  { id:13, outletId:"kopken", name:"Kenangan Milk Tea", cat:"Non Coffee", r:14000, l:19000, outlet:21000, emoji:"🧋" },
  { id:14, outletId:"kopken", name:"Milo Dinosaurus", cat:"Non Coffee", r:15000, l:20000, outlet:23000, emoji:"🦕" },
  { id:15, outletId:"kopken", name:"Pistachio Frappe", cat:"Non Coffee", r:19500, l:24500, outlet:32000, emoji:"🌿" },
  { id:16, outletId:"kopken", name:"Butterscotch Kenangan", cat:"Non Coffee", r:18500, l:23500, outlet:30000, emoji:"🧋" },
  { id:17, outletId:"kopken", name:"Oreo Shake", cat:"Non Coffee", r:16500, l:21500, outlet:26000, emoji:"🍪" },
  { id:18, outletId:"kopken", name:"Raspberry Hibiscus", cat:"Non Coffee", r:13500, l:18500, outlet:20000, emoji:"🌺" },
  { id:19, outletId:"kopken", name:"Matcha Kenangan Frappe", cat:"Non Coffee", r:19500, l:24500, outlet:32000, emoji:"🍵" },
  { id:20, outletId:"kopken", name:"Susu Grass Jelly", cat:"Non Coffee", r:15500, l:20500, outlet:24000, emoji:"🌿" },
  { id:21, outletId:"kopken", name:"Thai Tea", cat:"Non Coffee", r:null, l:14500, outlet:22000, emoji:"🧋" },
  { id:22, outletId:"kopken", name:"Vanilla Kenangan Frappe", cat:"Non Coffee", r:16000, l:21000, outlet:25000, emoji:"🍦" },
  { id:23, outletId:"kopken", name:"Dutch Choco Kenangan Frappe", cat:"Non Coffee", r:18000, l:23000, outlet:29000, emoji:"🍫" },
  { id:24, outletId:"kopken", name:"Matcha Latte", cat:"Non Coffee", r:16000, l:21000, outlet:25000, emoji:"🍵" },
  { id:53, outletId:"kopken", name:"Choco Caramel (Beng-beng)", cat:"Non Coffee", r:13000, l:16500, outlet:19000, emoji:"🍫" },
  { id:54, outletId:"kopken", name:"Mocha Caramel (Beng-beng)", cat:"Non Coffee", r:16500, l:20000, outlet:26000, emoji:"☕" },
  { id:55, outletId:"kopken", name:"Choco Caramel Frappe (Beng-beng)", cat:"Non Coffee", r:17500, l:21000, outlet:28000, emoji:"🥤" },
  // ── Kopi ──
  { id:25, outletId:"kopken", name:"Toffee Nut Latte", cat:"Kopi", r:13000, l:18000, outlet:19000, emoji:"☕" },
  { id:26, outletId:"kopken", name:"Toffee Nut Aren Latte", cat:"Kopi", r:14000, l:19000, outlet:21000, emoji:"☕" },
  { id:27, outletId:"kopken", name:"Cafe Malt Latte", cat:"Kopi", r:15000, l:20000, outlet:23000, emoji:"☕" },
  { id:28, outletId:"kopken", name:"Kopi Kenangan Mantan", cat:"Kopi", r:13000, l:16500, outlet:19000, emoji:"💔" },
  { id:29, outletId:"kopken", name:"Toffee Nut Oat Latte", cat:"Kopi", r:14500, l:19500, outlet:22000, emoji:"🌾" },
  { id:30, outletId:"kopken", name:"Dubai Pistachio Latte", cat:"Kopi", r:16500, l:21500, outlet:26000, emoji:"☕" },
  { id:31, outletId:"kopken", name:"Caramel Latte", cat:"Kopi", r:16500, l:21500, outlet:26000, emoji:"☕" },
  { id:32, outletId:"kopken", name:"Dua Shot Iced Shaken", cat:"Kopi", r:17500, l:23500, outlet:28000, emoji:"☕" },
  { id:33, outletId:"kopken", name:"Pistachio Latte", cat:"Kopi", r:14500, l:19500, outlet:22000, emoji:"☕" },
  { id:34, outletId:"kopken", name:"Pistachio Aren Latte", cat:"Kopi", r:13000, l:18000, outlet:19000, emoji:"☕" },
  { id:35, outletId:"kopken", name:"Caramel Macchiato", cat:"Kopi", r:17500, l:23500, outlet:28000, emoji:"☕" },
  { id:36, outletId:"kopken", name:"Hazelnut Latte", cat:"Kopi", r:16500, l:21500, outlet:26000, emoji:"🌰" },
  { id:37, outletId:"kopken", name:"Kopi Susu Black Aren", cat:"Kopi", r:14000, l:19500, outlet:21000, emoji:"☕" },
  { id:38, outletId:"kopken", name:"Matcha Espresso", cat:"Kopi", r:16500, l:22000, outlet:26000, emoji:"🍵" },
  { id:39, outletId:"kopken", name:"Creamy Aren Latte", cat:"Kopi", r:14500, l:20000, outlet:22000, emoji:"☕" },
  { id:40, outletId:"kopken", name:"Butterscotch Aren Latte", cat:"Kopi", r:13500, l:18500, outlet:20000, emoji:"☕" },
  { id:41, outletId:"kopken", name:"Mocha Latte", cat:"Kopi", r:17500, l:23500, outlet:28000, emoji:"☕" },
  { id:42, outletId:"kopken", name:"Vanilla Latte", cat:"Kopi", r:16500, l:21500, outlet:26000, emoji:"☕" },
  { id:43, outletId:"kopken", name:"Butterscotch Sea Salt Latte", cat:"Kopi", r:16000, l:21000, outlet:25000, emoji:"☕" },
  { id:44, outletId:"kopken", name:"Americano", cat:"Kopi", r:12000, l:15500, outlet:17000, emoji:"⚫" },
  { id:45, outletId:"kopken", name:"Avocado Coffee", cat:"Kopi", r:17500, l:23500, outlet:28000, emoji:"🥑" },
  { id:46, outletId:"kopken", name:"Spanish Latte", cat:"Kopi", r:13000, l:18000, outlet:19000, emoji:"☕" },
  { id:47, outletId:"kopken", name:"Cappuccino", cat:"Kopi", r:14500, l:19000, outlet:22000, emoji:"☕" },
  { id:48, outletId:"kopken", name:"Latte", cat:"Kopi", r:14500, l:19000, outlet:22000, emoji:"☕" },
  // ── Oatside ──
  { id:49, outletId:"kopken", name:"Oatside Kopi Kenangan", cat:"Oatside", r:14500, l:17500, outlet:22000, emoji:"🌾" },
  { id:50, outletId:"kopken", name:"Oatside Latte", cat:"Oatside", r:16000, l:19500, outlet:25000, emoji:"🌾" },
  { id:51, outletId:"kopken", name:"Oatside Matcha Latte", cat:"Oatside", r:16000, l:19500, outlet:25000, emoji:"🌾" },
  // ── Makanan ──
  { id:56, outletId:"kopken", name:"Vanilla Choux Puff", cat:"Makanan", r:9000, l:null, outlet:12000, emoji:"🧁" },
  { id:57, outletId:"kopken", name:"Strawberry Choux Puff", cat:"Makanan", r:9000, l:null, outlet:12000, emoji:"🧁" },
  { id:58, outletId:"kopken", name:"Chocolate Choux Puff", cat:"Makanan", r:9000, l:null, outlet:12000, emoji:"🧁" },
  { id:59, outletId:"kopken", name:"Aren Apple Pie", cat:"Makanan", r:11500, l:null, outlet:17000, emoji:"🥧" },
  { id:60, outletId:"kopken", name:"Choco Muffin", cat:"Makanan", r:10500, l:null, outlet:15000, emoji:"🧁" },
  { id:61, outletId:"kopken", name:"Blueberry Muffin", cat:"Makanan", r:10500, l:null, outlet:15000, emoji:"🫐" },
  { id:62, outletId:"kopken", name:"Choco Mocha Swirl Toast", cat:"Makanan", r:11500, l:null, outlet:17000, emoji:"🍞" },
];

const INIT_SETTINGS = {
  minItems: 3,
  markup: 1000,
  telegramBot: "KopiHematBot",     // ← GANTI dengan username bot kamu (tanpa @)
  adminPass: "admin123",
  storeName: "Kopi Hemat",
  tagline: "Harga Orang Dalem 💸 Buat Semua!",
  qrisInfo: "Bayar via QRIS setelah konfirmasi pesanan. Ketik /tampilkan_qris ke bot untuk lihat QRIS."
};

// ─── UTILS ─────────────────────────────────────────────────────────────────────
const fmt = (n) => "Rp" + n.toLocaleString("id-ID");
const uid = () => Date.now() + Math.random().toString(36).slice(2);

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d0704;
  --surface:#1a0f09;
  --card:#231510;
  --border:#3a2218;
  --amber:#e8921a;
  --cream:#f5e0c0;
  --muted:#8a6a50;
  --red:#d32f2f;
  --green:#2e7d32;
  --white:#fff8f2;
  --r:14px;
}
body{background:var(--bg);color:var(--cream);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh}
h1,h2,h3,h4{font-family:'Playfair Display',serif}
input,select,textarea{outline:none;border:1px solid var(--border);background:var(--surface);color:var(--cream);font-family:'Plus Jakarta Sans',sans-serif;border-radius:8px;padding:8px 12px;font-size:14px;width:100%}
input:focus,select:focus,textarea:focus{border-color:var(--amber)}
button{cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;border:none;border-radius:8px;transition:all .15s}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--surface)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

.topbar{position:sticky;top:0;z-index:100;background:rgba(13,7,4,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 20px;height:60px;display:flex;align-items:center;justify-content:space-between}
.topbar-logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--amber);letter-spacing:-.3px}
.topbar-right{display:flex;gap:8px;align-items:center}

.hero{background:linear-gradient(135deg,#1a0f09 0%,#2d1408 50%,#1a0f09 100%);padding:28px 20px 20px;border-bottom:1px solid var(--border);position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-40px;right:-40px;width:180px;height:180px;background:radial-gradient(circle,rgba(232,146,26,.15) 0%,transparent 70%);pointer-events:none}
.hero h2{font-size:26px;color:var(--white);line-height:1.2}
.hero p{color:var(--muted);font-size:13px;margin-top:6px}

.outlet-tabs{display:flex;gap:8px;padding:12px 20px;overflow-x:auto;border-bottom:1px solid var(--border);background:var(--surface)}
.outlet-tab{padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;white-space:nowrap;border:1px solid var(--border);background:transparent;color:var(--muted);transition:all .2s}
.outlet-tab.active{background:var(--amber);color:#0d0704;border-color:var(--amber)}

.cat-bar{display:flex;gap:8px;padding:10px 20px;overflow-x:auto;background:var(--surface)}
.cat-btn{padding:5px 12px;border-radius:16px;font-size:12px;font-weight:600;white-space:nowrap;border:1px solid var(--border);background:transparent;color:var(--muted)}
.cat-btn.active{background:var(--card);color:var(--cream);border-color:var(--muted)}

.search-bar{padding:10px 20px;background:var(--surface);border-bottom:1px solid var(--border)}
.search-bar input{background:var(--card)}

.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;padding:16px 20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:transform .2s,border-color .2s}
.card:hover{transform:translateY(-2px);border-color:var(--amber)}
.card-emoji{background:linear-gradient(135deg,#2d1a0e,#3d2415);height:90px;display:flex;align-items:center;justify-content:center;font-size:42px}
.card-body{padding:10px}
.card-name{font-size:12px;font-weight:600;color:var(--white);line-height:1.3;margin-bottom:6px}
.card-outlet-price{font-size:10px;color:var(--muted);text-decoration:line-through;margin-bottom:2px}
.card-sizes{display:flex;flex-direction:column;gap:4px}
.size-row{display:flex;justify-content:space-between;align-items:center;gap:4px}
.size-label{font-size:10px;font-weight:700;color:var(--muted);background:var(--surface);padding:2px 6px;border-radius:4px;min-width:24px;text-align:center}
.size-price{font-size:11px;font-weight:700;color:var(--amber)}
.add-btn{margin-top:8px;width:100%;padding:6px;background:var(--amber);color:#0d0704;font-size:12px;border-radius:8px}
.add-btn:hover{background:#f5a831}
.add-btn:disabled{background:var(--border);color:var(--muted);cursor:default}

.cart-fab{position:fixed;bottom:24px;right:20px;z-index:99;background:var(--amber);color:#0d0704;border-radius:50px;padding:12px 20px;font-size:15px;font-weight:700;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(232,146,26,.4)}
.cart-fab:hover{background:#f5a831;transform:scale(1.04)}
.badge{background:#d32f2f;color:#fff;border-radius:10px;padding:1px 7px;font-size:11px}

.drawer{position:fixed;inset:0;z-index:200;display:flex}
.drawer-overlay{flex:1;background:rgba(0,0,0,.6);backdrop-filter:blur(2px)}
.drawer-panel{width:340px;max-width:100vw;background:var(--surface);border-left:1px solid var(--border);display:flex;flex-direction:column;overflow:hidden}
.drawer-head{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.drawer-body{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:8px}
.drawer-foot{padding:16px;border-top:1px solid var(--border)}

.cart-item{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:10px 12px;display:flex;align-items:center;gap:10px}
.ci-emoji{font-size:24px;flex-shrink:0}
.ci-info{flex:1;min-width:0}
.ci-name{font-size:12px;font-weight:600;color:var(--white);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ci-sub{font-size:11px;color:var(--muted)}
.ci-price{font-size:13px;font-weight:700;color:var(--amber)}
.qty-ctrl{display:flex;align-items:center;gap:6px;margin-top:4px}
.qty-btn{width:22px;height:22px;border-radius:6px;background:var(--border);color:var(--cream);font-size:14px;display:flex;align-items:center;justify-content:center;padding:0}
.qty-btn:hover{background:var(--amber);color:#0d0704}
.qty-num{font-size:13px;font-weight:600;min-width:20px;text-align:center}

.modal{position:fixed;inset:0;z-index:300;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);backdrop-filter:blur(4px);padding:16px}
.modal-box{background:var(--surface);border:1px solid var(--border);border-radius:16px;width:100%;max-width:440px;max-height:90vh;overflow-y:auto;padding:24px}
.modal-box h3{font-size:20px;color:var(--white);margin-bottom:16px}

.order-summary{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:14px;font-size:13px}
.order-line{display:flex;justify-content:space-between;padding:4px 0;color:var(--cream)}
.order-line.total{font-weight:700;font-size:15px;color:var(--amber);border-top:1px solid var(--border);margin-top:6px;padding-top:8px}

.tg-msg{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:12px;font-size:11px;color:var(--muted);white-space:pre-wrap;word-break:break-all;max-height:150px;overflow-y:auto;margin-bottom:14px;font-family:monospace}

.btn-primary{background:var(--amber);color:#0d0704;padding:12px 20px;font-size:14px;font-weight:700;border-radius:10px;width:100%}
.btn-primary:hover{background:#f5a831}
.btn-secondary{background:var(--card);color:var(--cream);border:1px solid var(--border);padding:10px 16px;font-size:13px}
.btn-secondary:hover{border-color:var(--muted)}
.btn-danger{background:#7f1d1d;color:#fca5a5;padding:6px 12px;font-size:12px}
.btn-danger:hover{background:#991b1b}
.btn-tg{background:#229ed9;color:#fff;padding:12px 20px;font-size:14px;font-weight:700;border-radius:10px;width:100%;margin-top:8px}
.btn-tg:hover{background:#1a86bb}

/* Admin */
.admin-nav{display:flex;gap:4px;padding:12px 20px;border-bottom:1px solid var(--border);background:var(--surface)}
.nav-tab{padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600;color:var(--muted);background:transparent;border:none}
.nav-tab.active{background:var(--card);color:var(--amber)}
.admin-body{padding:20px;max-width:900px}

.table{width:100%;border-collapse:collapse;font-size:13px}
.table th{text-align:left;padding:8px 10px;color:var(--muted);border-bottom:1px solid var(--border);font-weight:600}
.table td{padding:8px 10px;border-bottom:1px solid rgba(58,34,24,.5);color:var(--cream);vertical-align:middle}
.table tr:hover td{background:rgba(255,255,255,.02)}

.form-row{margin-bottom:14px}
.form-row label{display:block;font-size:12px;color:var(--muted);margin-bottom:5px;font-weight:600}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}

.alert-info{background:rgba(33,150,243,.1);border:1px solid rgba(33,150,243,.3);border-radius:8px;padding:10px 14px;font-size:13px;color:#90caf9;margin-bottom:16px}
.tag{display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:700}
.tag-kopi{background:rgba(232,146,26,.2);color:var(--amber)}
.tag-nc{background:rgba(46,125,50,.2);color:#81c784}
.tag-makanan{background:rgba(156,39,176,.2);color:#ce93d8}
.tag-oatside{background:rgba(33,150,243,.2);color:#90caf9}

.empty{text-align:center;padding:40px 20px;color:var(--muted)}
.empty-icon{font-size:48px;display:block;margin-bottom:12px}

@media(max-width:600px){
  .grid{grid-template-columns:repeat(2,1fr);gap:8px;padding:12px}
  .drawer-panel{width:100vw}
  .form-grid{grid-template-columns:1fr}
}
`;

// ─── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const [outlets, setOutlets] = useState(INIT_OUTLETS);
  const [catalog, setCatalog] = useState(INIT_CATALOG);
  const [settings, setSettings] = useState(INIT_SETTINGS);
  const [view, setView] = useState("customer");
  const [adminAuth, setAdminAuth] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const [sv, ov, cv] = await Promise.all([
        store.get("kh_settings", INIT_SETTINGS),
        store.get("kh_outlets", INIT_OUTLETS),
        store.get("kh_catalog", INIT_CATALOG),
      ]);
      setSettings(sv); setOutlets(ov); setCatalog(cv);
      setLoaded(true);
    })();
  }, []);

  const saveSettings = async (s) => { setSettings(s); await store.set("kh_settings", s); };
  const saveOutlets  = async (o) => { setOutlets(o);  await store.set("kh_outlets", o); };
  const saveCatalog  = async (c) => { setCatalog(c);  await store.set("kh_catalog", c); };

  const cartTotal = cart.reduce((s, i) => s + (i.price + settings.markup) * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product, size, basePrice) => {
    const key = `${product.id}-${size}`;
    setCart(prev => {
      const ex = prev.find(i => i.key === key);
      if (ex) return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, {
        key, id: uid(), productId: product.id, name: product.name,
        outletName: outlets.find(o => o.id === product.outletId)?.name || "",
        emoji: product.emoji, size, price: basePrice
      }];
    });
  };

  const updateQty = (key, delta) => {
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  if (!loaded) return (
    <div style={{ background:"#0d0704", height:"100vh", display:"flex", alignItems:"center", justifyContent:"center", color:"#e8921a", fontFamily:"sans-serif" }}>
      Memuat...
    </div>
  );

  return (
    <>
      <style>{CSS}</style>
      {view === "customer" ? (
        <CustomerView
          outlets={outlets} catalog={catalog} settings={settings}
          cart={cart} cartCount={cartCount} cartTotal={cartTotal}
          cartOpen={cartOpen} setCartOpen={setCartOpen}
          checkoutOpen={checkoutOpen} setCheckoutOpen={setCheckoutOpen}
          addToCart={addToCart} updateQty={updateQty}
          setView={setView}
        />
      ) : (
        <AdminView
          outlets={outlets} catalog={catalog} settings={settings}
          adminAuth={adminAuth} setAdminAuth={setAdminAuth}
          saveOutlets={saveOutlets} saveCatalog={saveCatalog} saveSettings={saveSettings}
          setView={setView}
        />
      )}
    </>
  );
}

// ─── CUSTOMER VIEW ─────────────────────────────────────────────────────────────
function CustomerView({ outlets, catalog, settings, cart, cartCount, cartTotal, cartOpen, setCartOpen, checkoutOpen, setCheckoutOpen, addToCart, updateQty, setView }) {
  const [selectedOutlet, setSelectedOutlet] = useState(outlets[0]?.id || "");
  const [selectedCat, setSelectedCat] = useState("Semua");
  const [search, setSearch] = useState("");

  const outletCatalog = catalog.filter(p => p.outletId === selectedOutlet);
  const cats = ["Semua", ...new Set(outletCatalog.map(p => p.cat))];
  const filtered = outletCatalog.filter(p =>
    (selectedCat === "Semua" || p.cat === selectedCat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="topbar">
        <div className="topbar-logo">☕ {settings.storeName}</div>
        <div className="topbar-right">
          <button className="btn-secondary" style={{fontSize:12,padding:"5px 10px"}} onClick={() => setView("admin")}>Admin</button>
          <button className="cart-fab" style={{position:"static",boxShadow:"none",padding:"7px 14px",fontSize:13}} onClick={() => setCartOpen(true)}>
            🛒 {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      <div className="hero">
        <h2>{settings.storeName}</h2>
        <p>{settings.tagline}</p>
        <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
          <span style={{background:"rgba(211,47,47,.2)",color:"#ef9a9a",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>🔥 Hemat s/d 40%</span>
          <span style={{background:"rgba(232,146,26,.15)",color:"var(--amber)",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>⚡ Pickup & Dine In</span>
          <span style={{background:"rgba(46,125,50,.15)",color:"#81c784",padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:600}}>📱 Order via Telegram</span>
        </div>
      </div>

      <div className="outlet-tabs">
        {outlets.map(o => (
          <button key={o.id} className={`outlet-tab ${selectedOutlet === o.id ? "active" : ""}`}
            onClick={() => { setSelectedOutlet(o.id); setSelectedCat("Semua"); }}>
            {o.emoji} {o.name}
          </button>
        ))}
      </div>

      <div className="search-bar">
        <input placeholder="🔍 Cari minuman / makanan..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="cat-bar">
        {cats.map(c => (
          <button key={c} className={`cat-btn ${selectedCat === c ? "active" : ""}`} onClick={() => setSelectedCat(c)}>{c}</button>
        ))}
      </div>

      {settings.minItems > 1 && (
        <div style={{padding:"8px 20px",background:"rgba(232,146,26,.08)",borderBottom:"1px solid var(--border)",fontSize:12,color:"var(--amber)"}}>
          ⚠️ Minimum pembelian: <strong>{settings.minItems} item</strong>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty"><span className="empty-icon">😔</span>Produk tidak ditemukan</div>
      ) : (
        <div className="grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} markup={settings.markup} addToCart={addToCart} />)}
        </div>
      )}

      <div style={{height:80}} />

      {cartCount > 0 && (
        <button className="cart-fab" onClick={() => setCartOpen(true)}>
          🛒 Keranjang <span className="badge">{cartCount}</span>
          <span style={{marginLeft:4,fontSize:13}}>{fmt(cartTotal + cartCount * settings.markup)}</span>
        </button>
      )}

      {cartOpen && (
        <CartDrawer cart={cart} settings={settings} updateQty={updateQty}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      )}

      {checkoutOpen && (
        <CheckoutModal cart={cart} settings={settings} outlets={outlets}
          onClose={() => setCheckoutOpen(false)} />
      )}
    </div>
  );
}

// ─── PRODUCT CARD ──────────────────────────────────────────────────────────────
function ProductCard({ product, markup, addToCart }) {
  const sizes = [];
  if (product.r) sizes.push({ label: "R", price: product.r });
  if (product.l) sizes.push({ label: "L", price: product.l });

  const [selectedSize, setSelectedSize] = useState(sizes[0]?.label || "");
  const currentSize = sizes.find(s => s.label === selectedSize) || sizes[0];

  return (
    <div className="card">
      <div className="card-emoji">{product.emoji}</div>
      <div className="card-body">
        <div className="card-name">{product.name}</div>
        <div className="card-outlet-price">Outlet: {fmt(product.outlet)}</div>
        <div className="card-sizes">
          {sizes.length > 1 && (
            <div style={{display:"flex",gap:4,marginBottom:4}}>
              {sizes.map(s => (
                <button key={s.label} onClick={() => setSelectedSize(s.label)}
                  style={{flex:1,padding:"3px 0",borderRadius:6,fontSize:11,fontWeight:700,
                    background: selectedSize===s.label ? "var(--amber)" : "var(--border)",
                    color: selectedSize===s.label ? "#0d0704" : "var(--muted)",border:"none"}}>
                  {s.label}
                </button>
              ))}
            </div>
          )}
          {currentSize && (
            <div className="size-row">
              <span className="size-label">{currentSize.label}</span>
              <span className="size-price">{fmt(currentSize.price + markup)}</span>
            </div>
          )}
        </div>
        <button className="add-btn" onClick={() => currentSize && addToCart(product, currentSize.label, currentSize.price)}>
          + Tambah
        </button>
      </div>
    </div>
  );
}

// ─── CART DRAWER ───────────────────────────────────────────────────────────────
function CartDrawer({ cart, settings, updateQty, onClose, onCheckout }) {
  const total = cart.reduce((s, i) => s + (i.price + settings.markup) * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const minOk = totalItems >= settings.minItems;

  return (
    <div className="drawer">
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer-panel">
        <div className="drawer-head">
          <h3 style={{fontSize:18}}>🛒 Keranjang ({totalItems})</h3>
          <button className="btn-secondary" style={{padding:"4px 10px"}} onClick={onClose}>✕</button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="empty"><span className="empty-icon">🛒</span>Keranjang kosong</div>
          ) : cart.map(item => (
            <div key={item.key} className="cart-item">
              <div className="ci-emoji">{item.emoji}</div>
              <div className="ci-info">
                <div className="ci-name">{item.name}</div>
                <div className="ci-sub">Ukuran {item.size} · {item.outletName}</div>
                <div className="ci-price">{fmt(item.price + settings.markup)}</div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => updateQty(item.key, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.key, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="drawer-foot">
          {!minOk && (
            <div style={{background:"rgba(211,47,47,.1)",border:"1px solid rgba(211,47,47,.3)",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#ef9a9a",marginBottom:10}}>
              ⚠️ Min. {settings.minItems} item — tambah {settings.minItems - totalItems} item lagi
            </div>
          )}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,fontSize:15,fontWeight:700,color:"var(--cream)"}}>
            <span>Total</span><span style={{color:"var(--amber)"}}>{fmt(total)}</span>
          </div>
          <button className="btn-primary" disabled={!minOk || cart.length===0} onClick={onCheckout}
            style={!minOk ? {background:"var(--border)",color:"var(--muted)",cursor:"default"} : {}}>
            Lanjut ke Checkout →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT MODAL ────────────────────────────────────────────────────────────
function CheckoutModal({ cart, settings, outlets, onClose }) {
  const [name, setName] = useState("");
  const [tgHandle, setTgHandle] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const [orderNum] = useState(() => "KH" + Date.now().toString().slice(-6));
  const [copied, setCopied] = useState(false);

  const total = cart.reduce((s, i) => s + (i.price + settings.markup) * i.qty, 0);

  const generateMsg = () => {
    const lines = cart.map(i => `• ${i.name} (${i.size}) x${i.qty} = ${fmt((i.price+settings.markup)*i.qty)}`);
    return `🛒 *PESANAN BARU - ${settings.storeName}*\n📋 No. Order: ${orderNum}\n👤 Nama: ${name}\n📱 Telegram: @${tgHandle}\n\n${lines.join("\n")}\n\n💰 *Total: ${fmt(total)}*\n\n📝 Catatan: ${notes || "-"}\n\n✅ Kirim pesan ini ke bot lalu ketik /tampilkan_qris untuk QRIS`;
  };

  const copyMsg = () => {
    navigator.clipboard.writeText(generateMsg());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openTelegram = () => {
    window.open(`https://t.me/${settings.telegramBot}`, "_blank");
  };

  return (
    <div className="modal">
      <div className="modal-box">
        {step === 1 ? (
          <>
            <h3>📋 Detail Pemesan</h3>
            <div className="form-row">
              <label>Nama Lengkap *</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama kamu..." />
            </div>
            <div className="form-row">
              <label>Username Telegram *</label>
              <div style={{display:"flex",alignItems:"center",gap:4}}>
                <span style={{color:"var(--muted)",fontSize:14}}>@</span>
                <input value={tgHandle} onChange={e=>setTgHandle(e.target.value)} placeholder="username_telegram" />
              </div>
            </div>
            <div className="form-row">
              <label>Catatan (opsional)</label>
              <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="e.g. less ice, extra sugar..." />
            </div>
            <div className="order-summary">
              {cart.map(i => (
                <div key={i.key} className="order-line">
                  <span>{i.emoji} {i.name} ({i.size}) ×{i.qty}</span>
                  <span>{fmt((i.price+settings.markup)*i.qty)}</span>
                </div>
              ))}
              <div className="order-line total">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-secondary" style={{flex:1}} onClick={onClose}>Batal</button>
              <button className="btn-primary" style={{flex:2,...((!name||!tgHandle)?{background:"var(--border)",color:"var(--muted)",cursor:"default"}:{})}}
                disabled={!name||!tgHandle} onClick={()=>setStep(2)}>
                Lihat Ringkasan →
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>✅ Konfirmasi & Bayar</h3>
            <div className="alert-info">
              💡 Salin pesan di bawah, lalu kirim ke bot Telegram. Setelah itu ketik <strong>/tampilkan_qris</strong> untuk mendapat QRIS pembayaran.
            </div>
            <div style={{fontSize:12,color:"var(--muted)",marginBottom:6}}>📨 Pesan untuk dikirim ke bot:</div>
            <div className="tg-msg">{generateMsg()}</div>
            <button className="btn-secondary" style={{width:"100%",marginBottom:8}} onClick={copyMsg}>
              {copied ? "✅ Tersalin!" : "📋 Salin Pesan"}
            </button>
            <button className="btn-tg" onClick={openTelegram}>
              📱 Buka @{settings.telegramBot} di Telegram
            </button>
            <div style={{fontSize:11,color:"var(--muted)",textAlign:"center",marginTop:10,lineHeight:1.5}}>
              {settings.qrisInfo}
            </div>
            <button className="btn-secondary" style={{width:"100%",marginTop:12}} onClick={onClose}>← Kembali</button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN VIEW ────────────────────────────────────────────────────────────────
function AdminView({ outlets, catalog, settings, adminAuth, setAdminAuth, saveOutlets, saveCatalog, saveSettings, setView }) {
  const [tab, setTab] = useState("catalog");
  const [passInput, setPassInput] = useState("");
  const [passErr, setPassErr] = useState(false);

  if (!adminAuth) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",padding:20}}>
        <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:32,width:"100%",maxWidth:340}}>
          <h2 style={{fontSize:22,marginBottom:6,textAlign:"center"}}>⚙️ Admin Panel</h2>
          <p style={{fontSize:13,color:"var(--muted)",textAlign:"center",marginBottom:24}}>Masukkan password admin</p>
          <div className="form-row">
            <input type="password" value={passInput} onChange={e=>{setPassInput(e.target.value);setPassErr(false)}}
              placeholder="Password..." onKeyDown={e=>e.key==="Enter"&&(passInput===settings.adminPass?setAdminAuth(true):setPassErr(true))} />
            {passErr && <div style={{color:"#ef9a9a",fontSize:12,marginTop:4}}>❌ Password salah</div>}
          </div>
          <button className="btn-primary" onClick={()=>passInput===settings.adminPass?setAdminAuth(true):setPassErr(true)}>
            Masuk
          </button>
          <button className="btn-secondary" style={{width:"100%",marginTop:8}} onClick={()=>setView("customer")}>← Kembali ke Toko</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="topbar">
        <div className="topbar-logo">⚙️ Admin Panel</div>
        <div className="topbar-right">
          <button className="btn-secondary" style={{fontSize:12,padding:"5px 10px"}} onClick={()=>setView("customer")}>← Toko</button>
          <button className="btn-secondary" style={{fontSize:12,padding:"5px 10px"}} onClick={()=>setAdminAuth(false)}>Logout</button>
        </div>
      </div>
      <div className="admin-nav">
        {[["catalog","📦 Katalog"],["outlets","🏪 Outlet"],["settings","⚙️ Pengaturan"]].map(([t,l])=>(
          <button key={t} className={`nav-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>
      <div className="admin-body">
        {tab==="catalog"  && <CatalogTab  catalog={catalog} outlets={outlets} settings={settings} saveCatalog={saveCatalog} />}
        {tab==="outlets"  && <OutletsTab  outlets={outlets} saveOutlets={saveOutlets} />}
        {tab==="settings" && <SettingsTab settings={settings} saveSettings={saveSettings} />}
      </div>
    </div>
  );
}

// ─── CATALOG TAB ───────────────────────────────────────────────────────────────
function CatalogTab({ catalog, outlets, settings, saveCatalog }) {
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filterOutlet, setFilterOutlet] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const cats = ["all", ...new Set(catalog.map(p=>p.cat))];
  const filtered = catalog.filter(p=>
    (filterOutlet==="all"||p.outletId===filterOutlet) &&
    (filterCat==="all"||p.cat===filterCat)
  );

  const deleteItem = (id) => {
    if (window.confirm("Hapus produk ini?")) saveCatalog(catalog.filter(p=>p.id!==id));
  };

  const saveItem = (item) => {
    if (item.id) {
      saveCatalog(catalog.map(p=>p.id===item.id?item:p));
    } else {
      saveCatalog([...catalog, { ...item, id: uid() }]);
    }
    setEditItem(null); setShowForm(false);
  };

  const catColor = { Kopi:"tag-kopi", "Non Coffee":"tag-nc", Makanan:"tag-makanan", Oatside:"tag-oatside" };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8}}>
        <h3 style={{fontSize:20}}>📦 Katalog Produk ({catalog.length})</h3>
        <button className="btn-primary" style={{padding:"8px 16px",fontSize:13}}
          onClick={()=>{setEditItem({outletId:outlets[0]?.id||"",name:"",cat:"Kopi",r:"",l:"",outlet:"",emoji:"☕"});setShowForm(true)}}>
          + Tambah Produk
        </button>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <select value={filterOutlet} onChange={e=>setFilterOutlet(e.target.value)} style={{width:"auto",flex:1,minWidth:120}}>
          <option value="all">Semua Outlet</option>
          {outlets.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={filterCat} onChange={e=>setFilterCat(e.target.value)} style={{width:"auto",flex:1,minWidth:120}}>
          {cats.map(c=><option key={c} value={c}>{c==="all"?"Semua Kategori":c}</option>)}
        </select>
      </div>
      <div style={{overflowX:"auto"}}>
        <table className="table">
          <thead>
            <tr>
              <th>Produk</th><th>Outlet</th><th>Kategori</th>
              <th>Harga R</th><th>Harga L</th><th>Harga Outlet</th><th>Jual R</th><th>Jual L</th><th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const outletName = outlets.find(o=>o.id===p.outletId)?.name||p.outletId;
              return (
                <tr key={p.id}>
                  <td><span style={{marginRight:6}}>{p.emoji}</span>{p.name}</td>
                  <td style={{fontSize:11,color:"var(--muted)"}}>{outletName}</td>
                  <td><span className={`tag ${catColor[p.cat]||"tag-kopi"}`}>{p.cat}</span></td>
                  <td style={{color:"var(--muted)"}}>{p.r?fmt(p.r):"-"}</td>
                  <td style={{color:"var(--muted)"}}>{p.l?fmt(p.l):"-"}</td>
                  <td style={{color:"var(--muted)",textDecoration:"line-through",fontSize:11}}>{fmt(p.outlet)}</td>
                  <td style={{color:"var(--amber)",fontWeight:600}}>{p.r?fmt(p.r+settings.markup):"-"}</td>
                  <td style={{color:"var(--amber)",fontWeight:600}}>{p.l?fmt(p.l+settings.markup):"-"}</td>
                  <td>
                    <div style={{display:"flex",gap:4}}>
                      <button style={{background:"rgba(232,146,26,.15)",color:"var(--amber)",border:"none",borderRadius:6,padding:"4px 8px",fontSize:11,cursor:"pointer"}}
                        onClick={()=>{setEditItem(p);setShowForm(true)}}>Edit</button>
                      <button className="btn-danger" onClick={()=>deleteItem(p.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {showForm && editItem && (
        <ProductForm item={editItem} outlets={outlets} onSave={saveItem} onClose={()=>{setEditItem(null);setShowForm(false)}} />
      )}
    </div>
  );
}

// ─── PRODUCT FORM ──────────────────────────────────────────────────────────────
function ProductForm({ item, outlets, onSave, onClose }) {
  const [form, setForm] = useState({...item});
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  return (
    <div className="modal">
      <div className="modal-box">
        <h3 style={{marginBottom:16}}>{item.id?"✏️ Edit Produk":"➕ Tambah Produk"}</h3>
        <div className="form-grid">
          <div className="form-row">
            <label>Nama Produk *</label>
            <input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Nama produk..." />
          </div>
          <div className="form-row">
            <label>Emoji</label>
            <input value={form.emoji} onChange={e=>set("emoji",e.target.value)} placeholder="☕" />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <label>Outlet</label>
            <select value={form.outletId} onChange={e=>set("outletId",e.target.value)}>
              {outlets.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
          <div className="form-row">
            <label>Kategori</label>
            <input value={form.cat} onChange={e=>set("cat",e.target.value)} placeholder="Kopi / Non Coffee / Makanan..." />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <label>Harga Orang Dalem R</label>
            <input type="number" value={form.r||""} onChange={e=>set("r",e.target.value?Number(e.target.value):null)} placeholder="cth: 14500" />
          </div>
          <div className="form-row">
            <label>Harga Orang Dalem L</label>
            <input type="number" value={form.l||""} onChange={e=>set("l",e.target.value?Number(e.target.value):null)} placeholder="cth: 19500" />
          </div>
        </div>
        <div className="form-row">
          <label>Harga Outlet Normal</label>
          <input type="number" value={form.outlet||""} onChange={e=>set("outlet",Number(e.target.value))} placeholder="cth: 22000" />
        </div>
        <div style={{display:"flex",gap:8,marginTop:4}}>
          <button className="btn-secondary" style={{flex:1}} onClick={onClose}>Batal</button>
          <button className="btn-primary" style={{flex:2}} disabled={!form.name} onClick={()=>onSave(form)}>Simpan</button>
        </div>
      </div>
    </div>
  );
}

// ─── OUTLETS TAB ───────────────────────────────────────────────────────────────
function OutletsTab({ outlets, saveOutlets }) {
  const [editOutlet, setEditOutlet] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const deleteOutlet = (id) => {
    if (window.confirm("Hapus outlet ini? Produk yang terkait tidak akan terhapus.")) saveOutlets(outlets.filter(o=>o.id!==id));
  };
  const saveOutlet = (outlet) => {
    if (outlet.id && outlets.find(o=>o.id===outlet.id)) {
      saveOutlets(outlets.map(o=>o.id===outlet.id?outlet:o));
    } else {
      saveOutlets([...outlets, { ...outlet, id: outlet.name.toLowerCase().replace(/\s+/g,"-") + "-" + Date.now() }]);
    }
    setEditOutlet(null); setShowForm(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{fontSize:20}}>🏪 Outlet ({outlets.length})</h3>
        <button className="btn-primary" style={{padding:"8px 16px",fontSize:13}}
          onClick={()=>{setEditOutlet({name:"",emoji:"🏪",color:"#e8921a"});setShowForm(true)}}>
          + Tambah Outlet
        </button>
      </div>
      <div className="alert-info">💡 Tambahkan outlet lain seperti KFC, McDonald's, dll. Kemudian tambahkan produk dengan memilih outlet tersebut di tab Katalog.</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {outlets.map(o => (
          <div key={o.id} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:32}}>{o.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:15}}>{o.name}</div>
              <div style={{fontSize:12,color:"var(--muted)",marginTop:2}}>ID: {o.id} · Warna: <span style={{background:o.color,padding:"1px 8px",borderRadius:4,color:"#fff",fontSize:11}}>{o.color}</span></div>
            </div>
            <div style={{display:"flex",gap:6}}>
              <button style={{background:"rgba(232,146,26,.15)",color:"var(--amber)",border:"none",borderRadius:6,padding:"6px 12px",fontSize:12,cursor:"pointer"}}
                onClick={()=>{setEditOutlet(o);setShowForm(true)}}>Edit</button>
              <button className="btn-danger" onClick={()=>deleteOutlet(o.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
      {showForm && editOutlet && (
        <div className="modal">
          <div className="modal-box" style={{maxWidth:360}}>
            <h3 style={{marginBottom:16}}>{editOutlet.id?"✏️ Edit Outlet":"➕ Tambah Outlet"}</h3>
            <div className="form-row"><label>Nama Outlet</label><input value={editOutlet.name} onChange={e=>setEditOutlet(p=>({...p,name:e.target.value}))} placeholder="e.g. KFC, McDonald's..." /></div>
            <div className="form-grid">
              <div className="form-row"><label>Emoji</label><input value={editOutlet.emoji} onChange={e=>setEditOutlet(p=>({...p,emoji:e.target.value}))} /></div>
              <div className="form-row"><label>Warna (hex)</label><input value={editOutlet.color} onChange={e=>setEditOutlet(p=>({...p,color:e.target.value}))} /></div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="btn-secondary" style={{flex:1}} onClick={()=>{setEditOutlet(null);setShowForm(false)}}>Batal</button>
              <button className="btn-primary" style={{flex:2}} disabled={!editOutlet.name} onClick={()=>saveOutlet(editOutlet)}>Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SETTINGS TAB ──────────────────────────────────────────────────────────────
function SettingsTab({ settings, saveSettings }) {
  const [form, setForm] = useState({...settings});
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));

  const save = () => {
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{maxWidth:500}}>
      <h3 style={{fontSize:20,marginBottom:16}}>⚙️ Pengaturan Toko</h3>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:20,marginBottom:16}}>
        <h4 style={{fontSize:15,marginBottom:14,color:"var(--amber)"}}>🏪 Info Toko</h4>
        <div className="form-row"><label>Nama Toko</label><input value={form.storeName} onChange={e=>set("storeName",e.target.value)} /></div>
        <div className="form-row"><label>Tagline</label><input value={form.tagline} onChange={e=>set("tagline",e.target.value)} /></div>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:20,marginBottom:16}}>
        <h4 style={{fontSize:15,marginBottom:14,color:"var(--amber)"}}>💰 Harga & Order</h4>
        <div className="form-row">
          <label>Markup per Item (Rp)</label>
          <input type="number" value={form.markup} onChange={e=>set("markup",Number(e.target.value))} />
          <div style={{fontSize:11,color:"var(--muted)",marginTop:4}}>Ditambahkan ke setiap item dalam keranjang</div>
        </div>
        <div className="form-row">
          <label>Minimum Item per Pesanan</label>
          <input type="number" min="1" value={form.minItems} onChange={e=>set("minItems",Number(e.target.value))} />
        </div>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:20,marginBottom:16}}>
        <h4 style={{fontSize:15,marginBottom:14,color:"#229ed9"}}>📱 Telegram</h4>
        <div className="form-row">
          <label>Username Bot Telegram (tanpa @)</label>
          <input value={form.telegramBot} onChange={e=>set("telegramBot",e.target.value)} placeholder="NamaBotmu" />
        </div>
        <div className="form-row">
          <label>Info QRIS (ditampilkan saat checkout)</label>
          <textarea value={form.qrisInfo} onChange={e=>set("qrisInfo",e.target.value)} rows={3} style={{resize:"vertical"}} />
        </div>
      </div>
      <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:12,padding:20,marginBottom:20}}>
        <h4 style={{fontSize:15,marginBottom:14,color:"var(--red)"}}>🔐 Keamanan</h4>
        <div className="form-row">
          <label>Password Admin</label>
          <input type="password" value={form.adminPass} onChange={e=>set("adminPass",e.target.value)} />
        </div>
      </div>
      <button className="btn-primary" style={{width:"100%"}} onClick={save}>
        {saved ? "✅ Tersimpan!" : "💾 Simpan Pengaturan"}
      </button>
    </div>
  );
}
