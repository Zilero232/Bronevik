import type { OverlayConfig } from '@otmetki/schemas';

import { overlayConfigSchema, overlayMetricSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { decodePreviewConfig, encodePreviewConfig, mergePreviewConfig } from '../preview-config';

const STORED: OverlayConfig = overlayConfigSchema.parse({ metrics: ['battles'], theme: 'tracer', accentColor: '#112233' });

const FULL: OverlayConfig = overlayConfigSchema.parse({
  theme: 'minimal',
  layout: 'grid',
  metrics: overlayMetricSchema.options.slice(0, 4),
  accentColor: '#ff6b1a',
  fontScale: 1.4,
  animate: false,
  showTank: false,
  resetAt: 'day',
  locale: 'en'
});

describe('encodePreviewConfig', () => {
  it('produces a value that survives a query string untouched', () => {
    const encoded = encodePreviewConfig(FULL);

    expect(encoded).toMatch(/^[\w-]+$/u);
    expect(encodeURIComponent(encoded)).toBe(encoded);
  });

  it('round-trips a full config through decode', () => {
    expect(decodePreviewConfig(encodePreviewConfig(FULL))).toEqual(FULL);
  });
});

describe('decodePreviewConfig', () => {
  it('returns null for an absent or empty value', () => {
    expect(decodePreviewConfig(null)).toBeNull();
    expect(decodePreviewConfig(undefined)).toBeNull();
    expect(decodePreviewConfig('')).toBeNull();
  });

  it('returns null for garbage that is not base64url JSON', () => {
    expect(decodePreviewConfig('%%%not-base64%%%')).toBeNull();
    expect(decodePreviewConfig(encodePreviewConfig({}).concat('!'))).toBeNull();
  });

  it('rejects a patch that breaks the contract', () => {
    const broken = btoa(JSON.stringify({ fontScale: 99 }));

    expect(decodePreviewConfig(broken)).toBeNull();
  });

  it('keeps only the keys the patch actually carried, so schema defaults never overwrite the stored config', () => {
    const patch = decodePreviewConfig(encodePreviewConfig({ layout: 'column' }));

    expect(Object.keys(patch ?? {})).toEqual(['layout']);
  });
});

describe('mergePreviewConfig', () => {
  it('returns the stored config when there is no patch', () => {
    expect(mergePreviewConfig({ config: STORED, patch: null })).toBe(STORED);
  });

  it('overrides only the patched fields', () => {
    const merged = mergePreviewConfig({ config: STORED, patch: { layout: 'grid' } });

    expect(merged.layout).toBe('grid');
    expect(merged.theme).toBe(STORED.theme);
    expect(merged.accentColor).toBe(STORED.accentColor);
  });
});
