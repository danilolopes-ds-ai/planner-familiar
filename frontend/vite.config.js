import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Plugin para lidar com recursos ausentes
    {
      name: 'ignore-missing-assets',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url && (req.url.includes('favicon.ico') || req.url.includes('manifest.json'))) {
            // Verificar se o arquivo existe antes de servir
            const fs = require('fs');
            const path = require('path');
            const filePath = path.join(__dirname, 'public', req.url);
            if (!fs.existsSync(filePath)) {
              console.warn(`Warning: Asset not found: ${req.url}`);
              res.statusCode = 404;
              res.end();
              return;
            }
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:5000'),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    exclude: ['fsevents'],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      target: 'es2020'
    }
  },
  base: './',
  server: {
    fs: {
      strict: false
    },
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      external: (id) => {
        // Externalize non-critical assets to avoid ERR_FILE_NOT_FOUND
        if (id.includes('favicon.ico') || id.includes('manifest.json')) {
          return false; // Keep them internal to be processed
        }
        return false;
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
        },
        assetFileNames: 'assets/[name]-[hash].[ext]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js'
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      }
    }
  }
})
