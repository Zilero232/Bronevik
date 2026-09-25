import { telegramLinkCodeSchema, telegramStatusSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { mockTelegram } from '../mock/telegram.mock';

describe('mockTelegram', () => {
  it('issues a code whose deep link carries it', () => {
    const { code, deepLink } = telegramLinkCodeSchema.parse(mockTelegram.issueCode());

    expect(deepLink?.endsWith(code)).toBe(true);
  });

  it('reports unlinked after unlinking', () => {
    mockTelegram.unlink();

    expect(telegramStatusSchema.parse(mockTelegram.status()).isLinked).toBe(false);
  });
});
