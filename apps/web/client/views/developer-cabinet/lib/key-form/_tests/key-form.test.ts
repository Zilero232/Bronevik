import { createApiKeySchema } from '@otmetki/schemas';
import { differenceInCalendarDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { KEY_EXPIRY } from '../../../config';
import { expiryToIso, toCreateApiKeyInput } from '../key-form';
import { createKeyFormSchema } from '../key-form.schemas';

const NOW = new Date('2026-09-25T12:00:00.000Z');

describe('expiryToIso', () => {
  it('sends no expiry for a key that never expires', () => {
    expect(expiryToIso({ expiry: 'never', now: NOW })).toBeUndefined();
  });

  it('puts every limited option the chosen number of days ahead', () => {
    KEY_EXPIRY.options
      .filter((expiry) => expiry !== 'never')
      .forEach((expiry) => {
        const iso = expiryToIso({ expiry, now: NOW });

        expect(differenceInCalendarDays(new Date(iso ?? ''), NOW)).toBe(Number(expiry));
      });
  });

  it('produces a value the create-key contract accepts', () => {
    KEY_EXPIRY.options.forEach((expiry) => {
      expect(createApiKeySchema.safeParse({ name: 'bot', expiresAt: expiryToIso({ expiry, now: NOW }) }).success).toBe(true);
    });
  });
});

describe('toCreateApiKeyInput', () => {
  it('trims the name and leaves the expiry out for a permanent key', () => {
    expect(toCreateApiKeyInput({ name: '  Clan bot ', expiry: 'never', now: NOW })).toEqual({ name: 'Clan bot' });
  });

  it('passes the computed expiry for a limited key', () => {
    expect(toCreateApiKeyInput({ name: 'bot', expiry: '30', now: NOW }).expiresAt).toBe(expiryToIso({ expiry: '30', now: NOW }));
  });
});

describe('createKeyFormSchema', () => {
  it('keeps the shared name rules and knows only the offered expiry options', () => {
    expect(createKeyFormSchema.safeParse({ name: ' ', expiry: 'never' }).success).toBe(false);
    expect(createKeyFormSchema.safeParse({ name: 'bot', expiry: '7' }).success).toBe(false);
    expect(createKeyFormSchema.safeParse({ name: 'bot', expiry: KEY_EXPIRY.initial }).success).toBe(true);
  });
});
