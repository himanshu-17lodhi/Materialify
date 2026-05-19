import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],

    setupFiles: ['./src/test-setup.ts'],

    environment: 'happy-dom',

    coverage: {
      provider: 'istanbul',

      reporter: ['text', 'json-summary', 'json'],

      all: false,

      include: ['src/**/*.ts'],

      exclude: [
        '**/*.test.ts',

        'tests/**',

        'src/main.ts',

        'src/settings/**',
        'src/ui/**',
        'src/migrations/**',

        'src/editor/live-preview/**',
        'src/editor/markdown-processors/**',

        'src/material-icon-theme/generated.ts',
      ],

      thresholds: {
        lines: 50,
        branches: 45,
        functions: 50,
        statements: 50,
      },
    },
  },

  resolve: {
    alias: [
      {
        find: '@app',
        replacement: resolve(__dirname, './src'),
      },
      {
        find: '@lib',
        replacement: resolve(__dirname, './src/lib'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
      },
      {
        find: '@tests',
        replacement: resolve(__dirname, './tests'),
      },
    ],
  },
});
