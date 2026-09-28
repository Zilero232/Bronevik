import { describe, expect, it } from 'vitest';

import { MANAGER_LINK } from '@/features/mod/open-in-manager/config';
import { managerLink, parseProfileCode } from '@/features/mod/open-in-manager/lib/manager-link';

const CODE = 'TM1.eJyrVkrLz1eyUkpKLFKqBQApfgT-';
const MANAGER_PRESET_RULE = /^[a-z0-9_]{1,32}$/;

describe('managerLink', () => {
  it('opens the app on the manager scheme', () => {
    const url = new URL(managerLink({ kind: 'open' }));

    expect(url.protocol).toBe(`${MANAGER_LINK.scheme}:`);
    expect(url.host).toBe(MANAGER_LINK.hosts.open);
  });

  it('carries a profile code unchanged as the path', () => {
    const url = new URL(managerLink({ kind: 'profile', code: CODE }));

    expect(url.host).toBe(MANAGER_LINK.hosts.profile);
    expect(url.pathname.slice(1)).toBe(CODE);
  });

  it('passes the preset as the query the manager reads', () => {
    for (const preset of MANAGER_LINK.presets) {
      const url = new URL(managerLink({ kind: 'install', preset }));

      expect(url.host).toBe(MANAGER_LINK.hosts.install);
      expect(url.searchParams.get(MANAGER_LINK.presetParam)).toBe(preset);
    }
  });

  it('starts an install without a query when no preset is given', () => {
    expect(new URL(managerLink({ kind: 'install' })).search).toBe('');
  });

  it('offers only presets the manager accepts', () => {
    expect(MANAGER_LINK.presets.every((preset) => MANAGER_PRESET_RULE.test(preset))).toBe(true);
  });
});

describe('parseProfileCode', () => {
  it('accepts a code and trims the whitespace a paste brings', () => {
    expect(parseProfileCode(`  ${CODE}\n`)).toBe(CODE);
  });

  it('accepts the base64 padding the mod may leave', () => {
    expect(parseProfileCode(`${CODE}==`)).toBe(`${CODE}==`);
  });

  it('rejects anything without the profile prefix', () => {
    expect(parseProfileCode(CODE.slice(MANAGER_LINK.profileCode.prefix.length))).toBeNull();
    expect(parseProfileCode('TM2.abc')).toBeNull();
  });

  it('rejects characters outside base64url', () => {
    expect(parseProfileCode('TM1.ab+c/d')).toBeNull();
    expect(parseProfileCode('TM1.ab c')).toBeNull();
  });

  it('rejects an empty body and missing input', () => {
    expect(parseProfileCode('TM1.')).toBeNull();
    expect(parseProfileCode('')).toBeNull();
    expect(parseProfileCode(null)).toBeNull();
    expect(parseProfileCode(undefined)).toBeNull();
  });

  it('accepts a code of exactly the maximum length and rejects a longer one', () => {
    const { prefix, maxLength } = MANAGER_LINK.profileCode;
    const longest = `${prefix}${'a'.repeat(maxLength - prefix.length)}`;

    expect(parseProfileCode(longest)).toBe(longest);
    expect(parseProfileCode(`${longest}a`)).toBeNull();
  });
});
