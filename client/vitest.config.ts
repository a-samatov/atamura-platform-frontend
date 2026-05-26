import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(async () => {
  const { default: vue } = await import('@vitejs/plugin-vue')
  return {
    plugins: [vue()],
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          target: 'ESNext',
          lib: ['ESNext', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          jsx: 'preserve',
        },
      },
    },
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./tests/setup.ts'],
      include: ['tests/unit/**/*.test.ts', 'tests/components/**/*.test.ts'],
      coverage: {
        provider: 'v8',
        include: ['composables/**/*.ts'],
        reporter: ['text', 'lcov'],
      },
    },
    resolve: {
      alias: {
        '~': resolve(__dirname, '.'),
        '@': resolve(__dirname, '.'),
      },
    },
  }
})
