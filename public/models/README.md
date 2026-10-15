# 3D models

Put your Draco-compressed `.glb` here, e.g. `coffee-cup.glb`, then set
`CUP_MODEL_URL = '/models/coffee-cup.glb'` in `src/components/three/CoffeeCup.tsx`.

Until then the site renders a built-in procedural ceramic cup (no download needed).

## Free model sources (check each license — CC0 / CC-BY)
- Poly Pizza — https://poly.pizza/search/coffee%20cup
- Sketchfab (filter "Downloadable") — https://sketchfab.com/search?q=coffee+cup&features=downloadable
- Polyhaven models — https://polyhaven.com/models

## Compress (Draco + WebP textures)
```bash
# put the original as public/models/source.glb, then:
npm run optimize:glb
```
The model is auto-centered and scaled to ~1.25 units tall, so any size works.
