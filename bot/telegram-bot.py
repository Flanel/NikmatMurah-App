"""
Kopi Hemat - Telegram Bot
==========================
Fitur:
  - Terima pesanan dari customer
  - /tampilkan_qris → kirim gambar QRIS ke customer
  - Notifikasi pesanan masuk ke admin
  - /konfirmasi <order_id> → konfirmasi pesanan (admin only)
  - /batalkan <order_id> → batalkan pesanan (admin only)
  - /daftar_order → lihat semua pesanan pending (admin only)

Cara pakai:
  1. pip install -r requirements.txt
  2. Salin .env.example → .env, lalu isi nilainya
  3. Taruh file QRIS kamu dengan nama qris.jpg di folder yang sama
  4. python telegram-bot.py
"""

import logging
import json
import os
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application, CommandHandler, MessageHandler,
    CallbackQueryHandler, filters, ContextTypes
)

# ─── CONFIG (dari .env) ───────────────────────────────────────────────────────
load_dotenv()

BOT_TOKEN       = os.getenv("BOT_TOKEN", "")
ADMIN_CHAT_ID   = int(os.getenv("ADMIN_CHAT_ID", "0"))
QRIS_IMAGE_PATH = os.getenv("QRIS_IMAGE_PATH", "qris.jpg")
STORE_NAME      = os.getenv("STORE_NAME", "Kopi Hemat")

# ─── STORAGE (simpel, pakai file JSON) ───────────────────────────────────────
ORDERS_FILE = "orders.json"

def load_orders():
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE) as f:
            return json.load(f)
    return {}

def save_orders(orders):
    with open(ORDERS_FILE, "w") as f:
        json.dump(orders, f, indent=2, ensure_ascii=False)

orders_db = load_orders()

# ─── LOGGING ─────────────────────────────────────────────────────────────────
logging.basicConfig(format="%(asctime)s - %(levelname)s - %(message)s", level=logging.INFO)
log = logging.getLogger(__name__)

# ─── HELPERS ─────────────────────────────────────────────────────────────────
def generate_order_id():
    return "KH" + datetime.now().strftime("%Y%m%d%H%M%S")

def is_admin(update: Update) -> bool:
    return update.effective_user.id == ADMIN_CHAT_ID

def fmt_order(order: dict) -> str:
    lines = [
        f"📋 *Order #{order['id']}*",
        f"👤 {order['name']} (@{order['tg_handle']})",
        f"📅 {order['created_at']}",
        f"📦 Status: {order['status']}",
        "",
        "🛒 *Item:*",
    ]
    for item in order["items"]:
        lines.append(f"  • {item}")
    lines.append("")
    lines.append(f"💰 *Total: {order['total']}*")
    if order.get("notes"):
        lines.append(f"📝 Catatan: {order['notes']}")
    return "\n".join(lines)

# ─── HANDLERS ─────────────────────────────────────────────────────────────────

async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Saat customer buka bot"""
    user = update.effective_user
    await update.message.reply_text(
        f"Halo {user.first_name}! 👋\n\n"
        f"Selamat datang di *{STORE_NAME}* 🛒\n\n"
        "📱 *Cara pesan:*\n"
        "1. Kunjungi website kami\n"
        "2. Pilih menu & tambah ke keranjang\n"
        "3. Checkout → salin pesan pesanan\n"
        "4. Kirim pesan tersebut ke sini\n"
        "5. Ketik /tampilkan\\_qris untuk QRIS\n\n"
        "💬 Kirim pesan pesanan kamu sekarang!",
        parse_mode="Markdown"
    )

async def tampilkan_qris(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Customer minta QRIS"""
    chat_id = update.effective_user.id

    user_orders = [o for o in orders_db.values()
                   if o["chat_id"] == chat_id and o["status"] == "pending"]

    if not user_orders:
        await update.message.reply_text(
            "⚠️ Kamu belum punya pesanan yang aktif.\n\n"
            "Silakan order dulu lewat website, lalu kirim pesan pesanan ke sini.",
            parse_mode="Markdown"
        )
        return

    latest_order = sorted(user_orders, key=lambda o: o["created_at"])[-1]

    try:
        if os.path.exists(QRIS_IMAGE_PATH):
            with open(QRIS_IMAGE_PATH, "rb") as qris_file:
                await update.message.reply_photo(
                    photo=qris_file,
                    caption=(
                        f"💳 *QRIS Pembayaran - {STORE_NAME}*\n\n"
                        f"📋 Order: #{latest_order['id']}\n"
                        f"💰 Total: *{latest_order['total']}*\n\n"
                        "✅ Scan QRIS di atas untuk bayar.\n"
                        "📸 Setelah bayar, kirim bukti transfer ke sini.\n"
                        "⏳ Pesanan akan diproses setelah pembayaran dikonfirmasi."
                    ),
                    parse_mode="Markdown"
                )
        else:
            await update.message.reply_text(
                f"💳 *QRIS Pembayaran*\n\n"
                f"📋 Order: #{latest_order['id']}\n"
                f"💰 Total: *{latest_order['total']}*\n\n"
                "⚠️ Gambar QRIS belum diatur admin.\n"
                "Hubungi admin untuk konfirmasi pembayaran.",
                parse_mode="Markdown"
            )
    except Exception as e:
        log.error(f"Error sending QRIS: {e}")
        await update.message.reply_text("❌ Gagal mengirim QRIS. Hubungi admin.")

async def handle_message(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Handle pesan masuk dari customer (termasuk pesan pesanan dari website)"""
    text = update.message.text or ""
    user = update.effective_user
    chat_id = user.id

    if "PESANAN BARU" in text and "No. Order" in text:
        lines = text.split("\n")
        order_id = None
        name = ""
        tg_handle = ""
        items = []
        total = ""
        notes = ""

        for line in lines:
            if "No. Order:" in line:
                order_id = line.split("No. Order:")[-1].strip()
            elif "Nama:" in line:
                name = line.split("Nama:")[-1].strip()
            elif "Telegram:" in line:
                tg_handle = line.split("Telegram:")[-1].strip().replace("@", "")
            elif line.strip().startswith("•"):
                items.append(line.strip()[2:])
            elif "Total:" in line and "Rp" in line:
                total = line.split("Total:")[-1].strip().replace("*", "")
            elif "Catatan:" in line:
                notes = line.split("Catatan:")[-1].strip()

        if not order_id:
            order_id = generate_order_id()

        order = {
            "id": order_id,
            "chat_id": chat_id,
            "name": name,
            "tg_handle": tg_handle,
            "items": items,
            "total": total,
            "notes": notes,
            "status": "pending",
            "created_at": datetime.now().strftime("%d/%m/%Y %H:%M")
        }
        orders_db[order_id] = order
        save_orders(orders_db)

        await update.message.reply_text(
            f"✅ *Pesanan Diterima!*\n\n"
            f"📋 Order ID: `{order_id}`\n"
            f"💰 Total: *{total}*\n\n"
            f"👉 Ketik /tampilkan\\_qris untuk mendapatkan QRIS pembayaran\n\n"
            f"⏳ Pesanan akan diproses setelah pembayaran dikonfirmasi.",
            parse_mode="Markdown"
        )

        keyboard = InlineKeyboardMarkup([
            [
                InlineKeyboardButton("✅ Konfirmasi", callback_data=f"confirm_{order_id}"),
                InlineKeyboardButton("❌ Batalkan",   callback_data=f"cancel_{order_id}")
            ]
        ])

        await ctx.bot.send_message(
            chat_id=ADMIN_CHAT_ID,
            text=f"🔔 *PESANAN BARU MASUK!*\n\n{fmt_order(order)}",
            parse_mode="Markdown",
            reply_markup=keyboard
        )

    elif "bukti" in text.lower() or "transfer" in text.lower() or update.message.photo:
        user_orders = [o for o in orders_db.values()
                       if o["chat_id"] == chat_id and o["status"] == "pending"]

        if user_orders:
            latest = sorted(user_orders, key=lambda o: o["created_at"])[-1]
            await update.message.reply_text(
                f"📸 Bukti pembayaran diterima!\n\n"
                f"📋 Order: #{latest['id']}\n"
                "⏳ Admin akan segera konfirmasi pesanan kamu.",
                parse_mode="Markdown"
            )
            if update.message.photo:
                await ctx.bot.forward_message(
                    chat_id=ADMIN_CHAT_ID,
                    from_chat_id=chat_id,
                    message_id=update.message.message_id
                )
            await ctx.bot.send_message(
                ADMIN_CHAT_ID,
                f"💳 Customer @{user.username} kirim bukti bayar untuk order #{latest['id']}",
                parse_mode="Markdown"
            )
        else:
            await update.message.reply_text("ℹ️ Tidak ada pesanan aktif yang ditemukan.")
    else:
        await update.message.reply_text(
            "👋 Halo! Kirim pesan pesananmu yang disalin dari website, "
            "atau ketik /tampilkan\\_qris jika sudah pesan.",
            parse_mode="Markdown"
        )

# ─── ADMIN HANDLERS ───────────────────────────────────────────────────────────

async def daftar_order(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_admin(update):
        await update.message.reply_text("❌ Kamu bukan admin!")
        return

    pending = [o for o in orders_db.values() if o["status"] == "pending"]
    if not pending:
        await update.message.reply_text("📭 Tidak ada pesanan pending saat ini.")
        return

    for order in sorted(pending, key=lambda o: o["created_at"]):
        keyboard = InlineKeyboardMarkup([[
            InlineKeyboardButton("✅ Konfirmasi", callback_data=f"confirm_{order['id']}"),
            InlineKeyboardButton("❌ Batalkan",   callback_data=f"cancel_{order['id']}")
        ]])
        await update.message.reply_text(
            fmt_order(order), parse_mode="Markdown", reply_markup=keyboard
        )

async def konfirmasi_order(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_admin(update):
        return
    if not ctx.args:
        await update.message.reply_text("Penggunaan: /konfirmasi <order_id>")
        return
    await process_confirm(update, ctx, ctx.args[0])

async def batalkan_order(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_admin(update):
        return
    if not ctx.args:
        await update.message.reply_text("Penggunaan: /batalkan <order_id>")
        return
    await process_cancel(update, ctx, ctx.args[0])

async def button_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.from_user.id != ADMIN_CHAT_ID:
        await query.answer("❌ Bukan admin!", show_alert=True)
        return

    data = query.data
    if data.startswith("confirm_"):
        await process_confirm(update, ctx, data.replace("confirm_", ""), via_button=True)
    elif data.startswith("cancel_"):
        await process_cancel(update, ctx, data.replace("cancel_", ""), via_button=True)

async def process_confirm(update, ctx, order_id, via_button=False):
    order = orders_db.get(order_id)
    if not order:
        msg = f"❌ Order #{order_id} tidak ditemukan."
    elif order["status"] != "pending":
        msg = f"ℹ️ Order #{order_id} sudah {order['status']}."
    else:
        order["status"] = "confirmed"
        save_orders(orders_db)
        msg = f"✅ Order #{order_id} dikonfirmasi!"
        try:
            await ctx.bot.send_message(
                chat_id=order["chat_id"],
                text=f"✅ *Pesanan #{order_id} Dikonfirmasi!*\n\n"
                     f"💰 Total: {order['total']}\n\n"
                     "🎉 Pesanan kamu sedang diproses. Terima kasih sudah order!",
                parse_mode="Markdown"
            )
        except Exception as e:
            log.error(f"Gagal kirim notif ke customer: {e}")

    if via_button:
        await update.callback_query.edit_message_text(
            f"{update.callback_query.message.text}\n\n{msg}", parse_mode="Markdown"
        )
    else:
        await update.message.reply_text(msg)

async def process_cancel(update, ctx, order_id, via_button=False):
    order = orders_db.get(order_id)
    if not order:
        msg = f"❌ Order #{order_id} tidak ditemukan."
    elif order["status"] != "pending":
        msg = f"ℹ️ Order #{order_id} sudah {order['status']}."
    else:
        order["status"] = "cancelled"
        save_orders(orders_db)
        msg = f"❌ Order #{order_id} dibatalkan."
        try:
            await ctx.bot.send_message(
                chat_id=order["chat_id"],
                text=f"❌ *Pesanan #{order_id} Dibatalkan*\n\n"
                     "Maaf pesananmu tidak dapat diproses. "
                     "Silakan hubungi kami untuk info lebih lanjut.",
                parse_mode="Markdown"
            )
        except Exception as e:
            log.error(f"Gagal kirim notif ke customer: {e}")

    if via_button:
        await update.callback_query.edit_message_text(
            f"{update.callback_query.message.text}\n\n{msg}", parse_mode="Markdown"
        )
    else:
        await update.message.reply_text(msg)

# ─── MAIN ─────────────────────────────────────────────────────────────────────
def main():
    if not BOT_TOKEN:
        print("❌ ERROR: BOT_TOKEN belum diisi di file .env!")
        return
    if ADMIN_CHAT_ID == 0:
        print("❌ ERROR: ADMIN_CHAT_ID belum diisi di file .env!")
        return

    print(f"🚀 {STORE_NAME} Bot starting...")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("tampilkan_qris", tampilkan_qris))
    app.add_handler(CommandHandler("daftar_order", daftar_order))
    app.add_handler(CommandHandler("konfirmasi", konfirmasi_order))
    app.add_handler(CommandHandler("batalkan", batalkan_order))
    app.add_handler(CallbackQueryHandler(button_callback))
    app.add_handler(MessageHandler(filters.TEXT | filters.PHOTO, handle_message))

    print("✅ Bot aktif! Tekan Ctrl+C untuk berhenti.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()