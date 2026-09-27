import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

import { clearMocks } from '@tauri-apps/api/mocks';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

declare module 'vitest' {
  // eslint-disable-next-line ts/consistent-type-definitions -- declaration merging onto vitest's Matchers needs an interface
  interface Matchers<R extends Promise<void> | void = Promise<void> | void, T = unknown> extends TestingLibraryMatchers<T, R> {}
}

afterEach(() => {
  cleanup();
  clearMocks();
});
