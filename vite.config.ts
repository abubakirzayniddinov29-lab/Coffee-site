import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // Heavy 3D libs go into their own chunks; they are only requested
        // by the lazily-imported <Scene/>, so the first paint stays light.
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          post: ['@react-three/postprocessing', 'postprocessing'],
          motion: ['gsap', 'lenis'],
        },
      },
    },
  },
});
