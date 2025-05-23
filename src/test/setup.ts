import { afterAll, afterEach, beforeAll } from 'vitest';
import { unstable_dev } from 'wrangler';
import type { Unstable_DevWorker } from 'wrangler';

let worker: Unstable_DevWorker;

beforeAll(async () => {
  worker = await unstable_dev('src/infrastructure/worker.ts', {
    experimental: { disableExperimentalWarning: true },
  });
});

afterAll(async () => {
  await worker.stop();
});

// Reset all mocks after each test
afterEach(() => {
  vi.resetAllMocks();
});
