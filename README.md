# [BRAND NOMI] — Premium coffee website (3D + scroll animations)

Vite · React · TypeScript · Three.js (R3F + drei) · GSAP ScrollTrigger · Lenis · Tailwind

## Install & run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the build
```

## Where to swap things
| What | File |
|---|---|
| Brand name, all texts, menu & prices, contacts | `src/config/brand.ts` |
| Colors | `tailwind.config.js` + `src/config/brand.ts → COLORS` |
| Logo | `src/components/ui/Logo.tsx`, `public/favicon.svg` |
| 3D model (.glb) | `src/components/three/CoffeeCup.tsx → CUP_MODEL_URL` (see `public/models/README.md`) |
| Scroll choreography of the 3D object | `src/components/three/poses.ts` |
| Lighting / HDRI | `src/components/three/Scene.tsx → Lights` |
| Depth of field on/off | `src/components/three/Scene.tsx → ENABLE_DOF` |
| Telegram bot | `.env` (copy `.env.example`), `src/config/telegram.ts` |
| Map | `src/components/sections/Closing.tsx` (MAP PLACEHOLDER comment) |

## Telegram bot
1. Create a bot in @BotFather, copy the token.
2. Message the bot, open `https://api.telegram.org/bot<TOKEN>/getUpdates`, copy `chat.id`.
3. `cp .env.example .env` and fill `VITE_TG_BOT_TOKEN`, `VITE_TG_CHAT_ID`.

Without credentials the form runs in **demo mode** (shows success, logs payload to console).
⚠️ `VITE_*` values are visible in the browser. For production on Vercel set
`VITE_USE_SERVERLESS=true` + `TG_BOT_TOKEN` / `TG_CHAT_ID` — the form then posts to `api/order.js`.

## Deploy
- **Vercel:** import the repo → framework "Vite" → add env vars → Deploy. `api/order.js` is deployed automatically.
- **Netlify:** import the repo (settings in `netlify.toml`) → add env vars → Deploy.
  For the secret-token mode move `api/order.js` to `netlify/functions/`.

## Performance notes
- three.js and the scene are lazy-loaded (separate chunks); post-processing loads only on desktop.
- One instanced draw call for background beans; adaptive DPR via `PerformanceMonitor`.
- `prefers-reduced-motion`: no smooth scroll, no idle animations, instant text.
- No WebGL → static `public/fallback-cup.svg`.
- Compress custom models: `npm run optimize:glb` (Draco + WebP textures).
