import type { StreamerSettings } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { fieldKey, settingsAsText, settingsRows } from '../settings-format';

const provenance = { source: 'creator', sourceUrl: null, checkedAt: '2026-09-26T10:00:00.000Z' } as const;

const settings: StreamerSettings = {
  camera: { fov: 95, postMortem: false, ...provenance },
  zoom: { steps: ['x2', 'x8', 'x16'], ...provenance }
};

describe('settingsRows', () => {
  it('lists known fields of a group in declaration order', () => {
    expect(settingsRows(settings, 'camera')).toEqual([
      { path: 'camera.fov', value: 95 },
      { path: 'camera.postMortem', value: false }
    ]);

    expect(settingsRows(settings, 'display')).toEqual([]);
  });
});

describe('settingsAsText', () => {
  it('renders a copyable block per group', () => {
    const text = settingsAsText({ displayName: 'Jove', settings, label: (key) => key, value: (row) => String(row.value) });

    expect(text).toBe('Jove\n\n[camera]\ncamera.fov: 95\ncamera.postMortem: false\n\n[zoom]\nzoom.steps: x2, x8, x16');
  });
});

describe('fieldKey', () => {
  it('turns a path into an i18n-safe key', () => {
    expect(fieldKey('controls.sensitivity.sniper')).toBe('controls_sensitivity_sniper');
  });
});
