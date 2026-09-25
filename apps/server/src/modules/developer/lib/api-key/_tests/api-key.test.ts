import { describe, expect, it } from 'vitest';

import { API_KEY_FORMAT } from '../../../config';
import { apiKeyPrefix, generateApiKey, hashApiKey, matchesApiKeyHash } from '../api-key';

describe('generateApiKey', () => {
  it('produces a key in the documented format whose prefix and hash belong to it', () => {
    const generated = generateApiKey();

    expect(generated.key).toMatch(API_KEY_FORMAT.pattern);
    expect(apiKeyPrefix(generated.key)).toBe(generated.prefix);
    expect(generated.hash).toBe(hashApiKey(generated.key));
  });

  it('never repeats a key', () => {
    const keys = new Set(Array.from({ length: 50 }, () => generateApiKey().key));

    expect(keys.size).toBe(50);
  });
});

describe('apiKeyPrefix', () => {
  it('returns null for anything that is not a Bronevik key', () => {
    expect(apiKeyPrefix('')).toBeNull();
    expect(apiKeyPrefix('brv_short')).toBeNull();
    expect(apiKeyPrefix(`sk_${generateApiKey().key.slice(4)}`)).toBeNull();
  });

  it('tolerates surrounding whitespace from a pasted header', () => {
    const { key, prefix } = generateApiKey();

    expect(apiKeyPrefix(` ${key}\n`)).toBe(prefix);
  });
});

describe('matchesApiKeyHash', () => {
  it('accepts only the key the hash was made from', () => {
    const { key, hash } = generateApiKey();
    const other = generateApiKey();

    expect(matchesApiKeyHash({ key, hash })).toBe(true);
    expect(matchesApiKeyHash({ key: other.key, hash })).toBe(false);
  });
});
