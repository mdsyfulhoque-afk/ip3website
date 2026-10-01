import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * The dev server is not Vite's own: `npm run dev` boots server.js, which runs Vite in middleware
 * mode behind the Express API so the site and /api share one origin. This config therefore only
 * carries plugins and build output.
 *
 * `vite build` makes the client bundles; `vite build --ssr src/entry-server.tsx --outDir dist-ssr`
 * makes the renderer that scripts/prerender.mjs uses to write static HTML for every page.
 */
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  build: {
    target: 'es2022',
    outDir: isSsrBuild ? 'dist-ssr' : 'dist',
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    // Two independent bundles: the public site and the gated admin console.
    // None of the editor code ships to public visitors.
    ...(isSsrBuild
      ? {}
      : {
          rollupOptions: {
            input: {
              main: path.resolve(__dirname, 'index.html'),
              admin: path.resolve(__dirname, 'admin.html'),
            },
            output: {
              manualChunks(id: string) {
                if (id.includes('node_modules/three/')) return 'three';
                if (id.includes('node_modules/react-dom/') || id.includes('node_modules/react/') || id.includes('node_modules/react-router')) return 'react';
              },
            },
          },
        }),
  },
  ssr: { noExternal: ['react-router', 'react-router-dom'] },
}));
