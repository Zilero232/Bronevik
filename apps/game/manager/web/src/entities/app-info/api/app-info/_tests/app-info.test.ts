import appInfo from '@contract/app-info.json';
import { describe, expect, it } from 'vitest';

import { appInfoSchema } from '@/entities/app-info';

describe('appInfoSchema', () => {
  it('parses the paths and version the Rust core reports', () => {
    expect(appInfoSchema.parse(appInfo).stateRoot).toMatch(/TriOtmetki$/);
  });
});
