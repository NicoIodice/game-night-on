import { defineConfig } from 'vitest/config';

// `npm run check:voices`: the speech recognition check (scripts/voice-check), apart from the unit tests
// because it needs Chrome, edge-tts and the network.
export default defineConfig({
  test: {
    include: ['scripts/voice-check/**/*.check.ts'],
    testTimeout: 10 * 60_000,
    // One file, with checks one after the other so the report reads in order.
    fileParallelism: false,
  },
});
