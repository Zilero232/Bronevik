import status from '@contract/gameface-status.json';
import { describe, expect, it } from 'vitest';

import { gamefaceStatusSchema } from '@/entities/gameface';

describe('gamefaceStatusSchema', () => {
  it('parses whether OpenWG Gameface will restart the client once', () => {
    expect(gamefaceStatusSchema.parse(status).restartExpected).toBe(true);
  });
});
