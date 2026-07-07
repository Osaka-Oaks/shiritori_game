// Vite Build Optimization Configuration
// Use this for faster builds with aggressive optimizations

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react({
      // Fast refresh optimization
      fastRefresh: true,
      
      // Skip babel in development
      babel: {
        babelrc: false,
        configFile: false,
      },
    }),
    
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false,
    }),
  ],

  // Build optimizations
  build: {
    // Use esbuild (faster than terser)
    minify: 'esbuild',
    
    // Disable source maps in CI (saves ~30% build time)
    sourcemap: process.env.CI ? false : true,
    
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Optimize dependencies
    target: 'es2020',
    
    // Rollup optimizations
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        },
        
        // Smaller chunk names
        chunkFileNames: 'js/[hash].js',
        entryFileNames: 'js/[hash].js',
        assetFileNames: 'assets/[hash].[ext]',
      },
      
      // Tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
    
    // Increase concurrent builds
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Optimize CSS
    cssMinify: true,
    
    // Report compressed size (disable for faster builds)
    reportCompressedSize: false,
  },

  // Dependency optimization
  optimizeDeps: {
    // Pre-bundle dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'framer-motion',
    ],
    
    // Force optimization
    force: false, // Set to true to force re-optimization
    
    // Use esbuild
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'top-level-await': true,
      },
    },
  },

  // Server optimizations (for dev)
  server: {
    // Enable HMR
    hmr: true,
    
    // Faster file watching
    watch: {
      usePolling: false,
      interval: 100,
    },
    
    // Pre-transform known dependencies
    warmup: {
      clientFiles: [
        './src/main.tsx',
        './src/App.tsx',
        './src/components/**/*.tsx',
      ],
    },
  },

  // Cache directory
  cacheDir: 'node_modules/.vite',

  // Resolve optimizations
  resolve: {
    // Dedupe dependencies
    dedupe: ['react', 'react-dom'],
  },

  // Enable JSON named imports
  json: {
    namedExports: true,
    stringify: false,
  },

  // Disable unnecessary features
  define: {
    // Remove console in production
    ...(process.env.NODE_ENV === 'production' && {
      'console.log': '(() => {})',
      'console.debug': '(() => {})',
      'console.info': '(() => {})',
    }),
  },
});
