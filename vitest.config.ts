import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'miniflare',
    environmentOptions: {
      // Configure Miniflare to use our built worker
      scriptPath: 'dist/worker.js',
      // Bindings for tests
      bindings: {
        DB: {},
        CACHE: {},
        ENVIRONMENT: 'test',
        LOG_LEVEL: 'debug',
      },
    },
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.config.ts', '**/test/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}); 