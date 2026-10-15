/* ============================================================================
 * 🤖 TELEGRAM BOT CONFIG
 * ----------------------------------------------------------------------------
 * 1. Create a bot with @BotFather → copy the token.
 * 2. Send any message to your bot (or add it to a group), then open
 *    https://api.telegram.org/bot<TOKEN>/getUpdates and copy "chat":{"id": ...}
 * 3. Put them in a `.env` file (see .env.example):
 *      VITE_TG_BOT_TOKEN=123456:ABC...
 *      VITE_TG_CHAT_ID=-100123456789
 *
 * ⚠️ SECURITY: VITE_* variables are bundled into the browser JS, so the token is
 *    visible to anyone. For production set VITE_USE_SERVERLESS=true and put
 *    TG_BOT_TOKEN / TG_CHAT_ID (without VITE_) into Vercel env vars — the form
 *    will then POST to /api/order (see api/order.js) and the token stays secret.
 * ========================================================================== */

export const TELEGRAM = {
  BOT_TOKEN: (import.meta.env.VITE_TG_BOT_TOKEN as string | undefined) || 'YOUR_BOT_TOKEN_HERE',
  CHAT_ID: (import.meta.env.VITE_TG_CHAT_ID as string | undefined) || 'YOUR_CHAT_ID_HERE',
  USE_SERVERLESS: import.meta.env.VITE_USE_SERVERLESS === 'true',
  SERVERLESS_ENDPOINT: '/api/order',
};

export const isTelegramConfigured = () =>
  TELEGRAM.USE_SERVERLESS ||
  (!TELEGRAM.BOT_TOKEN.startsWith('YOUR_') && !TELEGRAM.CHAT_ID.startsWith('YOUR_'));
