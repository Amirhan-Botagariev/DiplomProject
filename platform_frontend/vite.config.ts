import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  // подгружаем переменные из .env для текущего mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), svgr()],
    server: {
      host: '0.0.0.0',
      port: 5173,

      // вот этот блок отвечает за polling‑watcher
      watch: {
        usePolling: true,   // вместо inotify
        interval: 100       // опрашивать каждые 100 мс
      },

      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          rewrite: (path) => path, // оставляем путь без изменений
        },
      },
      // ГЛАВНОЕ: fallback для SPA
      historyApiFallback: true,
    },
  };
});