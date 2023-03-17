// vite.config.js
import { defineConfig } from 'vite'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  cors: true,
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          next();
        });
      },
    },
  ],
});
