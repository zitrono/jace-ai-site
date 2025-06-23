import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://zitrono.github.io',
  base: '/ralph-web/',
  integrations: [
    tailwind(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true,
      },
      Image: false,
      JavaScript: true,
      SVG: true,
    }),
  ],
  output: 'static',
  outDir: './docs',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    assets: 'assets',
    inlineStylesheets: 'auto',
  },
  // Image optimization settings
  image: {
    service: {
      entrypoint: 'astro/assets/services/squoosh',
      config: {
        webp: { quality: 80 },
        avif: { quality: 75 },
        png: { quality: 90 },
        jpg: { quality: 85 },
      },
    },
  },
  vite: {
    build: {
      // Enhanced code splitting for better performance
      cssCodeSplit: true,
      // Optimize chunk sizes
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Optimize asset file naming for better caching
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'chunks/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js',
          // Manual chunk splitting for optimal loading
          manualChunks: (id) => {
            // Vendor chunk for better caching
            if (id.includes('node_modules')) {
              if (id.includes('astro')) return 'vendor-astro';
              if (id.includes('tailwind')) return 'vendor-tailwind';
              return 'vendor';
            }
            // Component chunks for better code splitting
            if (id.includes('/src/components/')) {
              if (id.includes('features/')) return 'features';
              if (id.includes('primitives/')) return 'primitives';
              if (id.includes('utils/')) return 'utils';
              return 'components';
            }
          },
        },
      },
      // Performance optimizations
      reportCompressedSize: false,
      sourcemap: false,
    },
    ssr: {
      noExternal: ['@astrojs/*'],
    },
    optimizeDeps: {
      exclude: ['@astrojs/telemetry'],
      // Include common dependencies for faster dev startup
      include: ['@astrojs/tailwind', 'tailwindcss'],
    },
    // Performance enhancements
    esbuild: {
      // Optimize JavaScript output
      drop: ['console', 'debugger'],
      legalComments: 'none',
    },
    // CSS optimization
    css: {
      devSourcemap: false,
      // Enable CSS modules for better scoping
      modules: {
        localsConvention: 'camelCase',
      },
    },
  },
});
