import { TELEGRAM, isTelegramConfigured } from '../config/telegram';

export type OrderPayload = {
  name: string;
  phone: string;
  drink: string;
  qty: number;
  note?: string;
};

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);

export async function sendOrder(order: OrderPayload): Promise<{ ok: boolean; demo?: boolean }> {
  // Demo mode: nothing configured yet → pretend success so the UI can be previewed.
  if (!isTelegramConfigured()) {
    console.warn('[order] Telegram is not configured — see src/config/telegram.ts. Payload:', order);
    await new Promise((r) => setTimeout(r, 900));
    return { ok: true, demo: true };
  }

  if (TELEGRAM.USE_SERVERLESS) {
    const r = await fetch(TELEGRAM.SERVERLESS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return { ok: r.ok };
  }

  const text =
    `☕️ <b>Yangi buyurtma</b>\n\n` +
    `👤 <b>Ism:</b> ${esc(order.name)}\n` +
    `📞 <b>Telefon:</b> ${esc(order.phone)}\n` +
    `🥤 <b>Ichimlik:</b> ${esc(order.drink)} × ${order.qty}\n` +
    (order.note ? `📝 <b>Izoh:</b> ${esc(order.note)}\n` : '') +
    `\n🕒 ${new Date().toLocaleString('uz-UZ')}`;

  const r = await fetch(`https://api.telegram.org/bot${TELEGRAM.BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TELEGRAM.CHAT_ID, text, parse_mode: 'HTML' }),
  });
  const data = await r.json().catch(() => ({ ok: false }));
  return { ok: !!data.ok };
}
