# ☕ Kopi Hemat

> Harga Orang Dalem 💸 Buat Semua!

Web app order + Telegram bot untuk jualan minuman dengan harga lebih hemat dari outlet langsung.

---

## 📁 Struktur Folder

```
kopi-hemat/
├── web/          ← React app (deploy ke Vercel)
│   ├── src/
│   │   ├── App.jsx        ← Semua komponen UI
│   │   └── index.jsx      ← Entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── bot/          ← Telegram bot (jalankan di laptop/VPS)
│   ├── telegram-bot.py    ← Bot utama
│   ├── requirements.txt
│   └── TARUH_QRIS_DISINI.txt
│
└── README.md
```

---

## 🚀 LANGKAH 1 — Setup Telegram Bot

### 1a. Buat bot baru
1. Buka Telegram → cari **@BotFather**
2. Ketik `/newbot`
3. Isi nama bot (contoh: `Kopi Hemat`)
4. Isi username bot (contoh: `KopiHematBot`) — harus unik, diakhiri `Bot`
5. BotFather kasih **TOKEN** → copy sekarang

### 1b. Cari Chat ID kamu
1. Cari **@userinfobot** di Telegram
2. Kirim `/start`
3. Dia balas dengan **ID** kamu (angka seperti `987654321`) → copy

### 1c. Isi token di bot
Buka file `bot/telegram-bot.py`, cari baris ini dan isi:

```python
BOT_TOKEN     = "MASUKKAN_TOKEN_BOT_DISINI"    # ← paste token dari BotFather
ADMIN_CHAT_ID = 123456789                       # ← paste chat_id kamu
```

### 1d. Taruh file QRIS
- Simpan gambar QRIS kamu dengan nama **`qris.jpg`**
- Letakkan di folder `bot/` (sama dengan `telegram-bot.py`)

### 1e. Jalankan bot
```bash
cd bot
pip install -r requirements.txt
python telegram-bot.py
```

Bot harus tetap jalan (di laptop/VPS) agar bisa menerima pesan.

---

## 🌐 LANGKAH 2 — Deploy Web App ke Vercel

### Opsi A — Via GitHub + Vercel (Recommended)

1. **Upload ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git remote add origin https://github.com/USERNAME/kopi-hemat.git
   git push -u origin main
   ```

2. **Deploy ke Vercel:**
   - Buka [vercel.com](https://vercel.com) → Login dengan GitHub
   - Klik **"Add New Project"**
   - Import repo `kopi-hemat`
   - **Root Directory:** pilih `web`
   - **Framework Preset:** Vite (otomatis terdeteksi)
   - Klik **Deploy** → selesai!

3. Kamu dapat URL seperti `https://kopi-hemat-xxx.vercel.app`

### Opsi B — Via Vercel CLI

```bash
cd web
npm install
npx vercel
```

---

## ⚙️ LANGKAH 3 — Update Username Bot di Web App

Setelah dapat username bot dari BotFather, buka web app → klik **Admin** (pojok kanan atas) → **Pengaturan** → isi **Username Bot Telegram**.

Atau edit langsung di `web/src/App.jsx`:

```js
const INIT_SETTINGS = {
  telegramBot: "KopiHematBot",  // ← ganti dengan username bot kamu (tanpa @)
  adminPass: "admin123",        // ← GANTI password ini!
  ...
};
```

---

## 🔄 Alur Order Lengkap

```
Customer buka web → pilih produk → keranjang
→ Checkout → isi nama + username Telegram
→ Salin pesan pesanan → buka Telegram
→ Kirim pesan ke bot
→ Ketik /tampilkan_qris → dapat QRIS
→ Bayar → kirim bukti ke bot
→ Kamu dapat notif + tombol ✅ Konfirmasi
→ Customer dapat notif "Pesanan dikonfirmasi!"
→ Kamu pesenin ke orang dalem ✓
```

---

## 🤖 Perintah Bot

**Untuk customer:**
| Perintah | Fungsi |
|----------|--------|
| `/start` | Salam pembuka & panduan |
| `/tampilkan_qris` | Kirim gambar QRIS |

**Untuk admin:**
| Perintah | Fungsi |
|----------|--------|
| `/daftar_order` | Lihat semua pesanan pending |
| `/konfirmasi <id>` | Konfirmasi satu pesanan |
| `/batalkan <id>` | Batalkan satu pesanan |

---

## ⚙️ Admin Panel Web

- Klik tombol **Admin** di pojok kanan atas web
- Password default: `admin123` → **ganti di menu Pengaturan!**
- Fitur:
  - **📦 Katalog** — tambah/edit/hapus produk
  - **🏪 Outlet** — tambah outlet baru (KFC, dll)
  - **⚙️ Pengaturan** — markup, minimum order, nama toko, password

---

## 💡 Tips

- Bot harus tetap jalan agar bisa terima pesanan. Pakai VPS/server atau tools seperti PM2:
  ```bash
  npm install -g pm2
  pm2 start "python telegram-bot.py" --name kopi-hemat-bot
  pm2 save
  pm2 startup
  ```
- Data katalog tersimpan di `localStorage` browser masing-masing user — artinya perubahan di Admin hanya berlaku di browser itu. Untuk katalog yang konsisten, edit langsung di `INIT_CATALOG` di `App.jsx` lalu redeploy.
- File `orders.json` otomatis dibuat di folder bot saat ada pesanan masuk.

---

Made with ☕ & ❤️
