import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    // Mirrors tsconfig.json `paths: { "@/*": ["./src/*"] }`.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // A hostile timezone (UTC+14): dropping `timeZone: 'UTC'` from
    // formatNoteDate would shift dates by a day here and fail a test.
    env: { TZ: 'Pacific/Kiritimati' },
  },
});
