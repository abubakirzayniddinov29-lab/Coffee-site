// Vercel Serverless Function — keeps the Telegram bot token off the client.
// Set TG_BOT_TOKEN and TG_CHAT_ID in Vercel → Project → Settings → Environment Variables,
// and VITE_USE_SERVERLESS=true so the form posts here.
// (Netlify: move this file to netlify/functions/order.js and adapt the handler signature.)

const esc = (s = '') => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const token = process.env.TG_BOT_TOKEN;
  const chatId = process.env.TG_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'Bot not configured' });

  const { name, phone, drink, qty, note } = req.body || {};
  if (!name || !phone || !drink) return res.status(400).json({ ok: false, error: 'Missing fields' });

  const text =
    `☕️ <b>Yangi buyurtma</b>\n\n` +
    `👤 <b>Ism:</b> ${esc(name)}\n` +
    `📞 <b>Telefon:</b> ${esc(phone)}\n` +
    `🥤 <b>Ichimlik:</b> ${esc(drink)} × ${esc(qty || 1)}\n` +
    (note ? `📝 <b>Izoh:</b> ${esc(note)}\n` : '');

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });
  const data = await r.json();
  return res.status(data.ok ? 200 : 502).json({ ok: !!data.ok });
}
