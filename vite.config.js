import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import imagemin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    // Add PWA support
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(js|css|woff2)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    }),
    // Add image optimization
    imagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false
      },
      optipng: {
        optimizationLevel: 7
      },
      mozjpeg: {
        quality: 80
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox'
          },
          {
            name: 'removeEmptyAttrs',
            active: false
          }
        ]
      },
      webp: {
        quality: 85,  // Slightly higher quality for WebP
        lossless: false
      }
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    hmr: true, // Simplified HMR configuration
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks to reduce bundle size
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          charts: ['recharts'],
          utils: ['date-fns', 'lodash'],
          i18n: ['i18next', 'react-i18next'],
          maps: ['leaflet', 'react-leaflet'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js']
        },
        // Ensure all assets have proper content type and cache busting
        assetFileNames: (assetInfo) => {
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB to reduce warnings
    // Optimize image rendering
    assetsInlineLimit: 4096, // Files smaller than this will be inlined as base64
    cssCodeSplit: true,
    // Prioritize WebP images
    assetsInclude: ['**/*.webp']
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  css: {
    devSourcemap: true,
    // Optimizing CSS delivery
    modules: {
      localsConvention: 'camelCaseOnly'
    }
  }
})