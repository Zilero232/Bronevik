import type { ModSyncProfile } from '@otmetki/schemas';

import { MOD_SYNC } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { isStoredConfigKey, sanitizeProfile, sanitizeSet } from '../library-items';

const profile = (config: Record<string, unknown>): ModSyncProfile => ({
  id: 'p',
  name: 'Profile',
  created: 1,
  updated: 2,
  data: { config, components: { hit_log: { enabled: true } } }
});

describe('isStoredConfigKey', () => {
  it('refuses every excluded key and every key with an excluded prefix', () => {
    expect(MOD_SYNC.excludedConfigKeys.some(isStoredConfigKey)).toBe(false);
    expect(MOD_SYNC.excludedConfigPrefixes.some((prefix) => isStoredConfigKey(`${prefix}anything`))).toBe(false);
  });

  it('keeps an ordinary setting', () => {
    expect(isStoredConfigKey('hud_scale')).toBe(true);
  });
});

describe('sanitizeProfile', () => {
  it('drops the settings the mod never keeps in a profile and leaves the rest', () => {
    const [excluded] = MOD_SYNC.excludedConfigKeys;
    const [prefix] = MOD_SYNC.excludedConfigPrefixes;
    const sanitized = sanitizeProfile(profile({ [excluded]: 'x', [`${prefix}battles`]: true, hud_scale: 1.25 }));

    expect(sanitized.data).toEqual({ config: { hud_scale: 1.25 }, components: { hit_log: { enabled: true } } });
  });
});

describe('sanitizeSet', () => {
  it('drops repeated components keeping the first position of each', () => {
    const sanitized = sanitizeSet({ id: 's', name: 'Set', components: ['core', 'hit_log', 'core', 'ui', 'hit_log'], created: 1, updated: 1 });

    expect(sanitized.components).toEqual(['core', 'hit_log', 'ui']);
  });
});
