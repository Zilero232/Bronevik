import type { StreamerSettings } from '@otmetki/schemas';

import { STREAMER_SETTINGS_APPLICABLE } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { applicableGroups, applyFormSchema, hardwareOptions, toApplyRequest } from '..';

const provenance = { source: 'creator', sourceUrl: null, checkedAt: '2026-09-26T10:00:00.000Z' } as const;

const settings: StreamerSettings = {
  display: { resolution: '1920x1080', preset: 'medium', ...provenance },
  controls: { sensitivity: { sniper: 0.3 }, ...provenance },
  camera: { ...provenance },
  hardware: { gpu: 'RTX 3060', ...provenance }
};

describe('applicableGroups', () => {
  it('keeps only applicable groups that carry values', () => {
    const groups = applicableGroups(settings);

    expect(groups).toEqual(['display', 'controls']);
    expect(groups.every((group) => STREAMER_SETTINGS_APPLICABLE.includes(group))).toBe(true);
  });
});

describe('hardwareOptions', () => {
  it('offers the opt-ins only for picked groups that have such values', () => {
    expect(hardwareOptions({ settings, groups: ['display', 'controls'] })).toEqual({ hasResolution: true, hasSensitivity: true });
    expect(hardwareOptions({ settings, groups: ['camera'] })).toEqual({ hasResolution: false, hasSensitivity: false });
    expect(hardwareOptions({ settings: { display: { preset: 'low', ...provenance } }, groups: ['display'] }).hasResolution).toBe(false);
  });
});

describe('toApplyRequest', () => {
  it('never sends an opt-in that is not offered', () => {
    const request = toApplyRequest({
      slug: 'jove',
      values: { groups: ['camera'], includeResolution: true, includeSensitivity: true },
      options: { hasResolution: false, hasSensitivity: false }
    });

    expect(request).toEqual({ slug: 'jove', groups: ['camera'], includeResolution: false, includeSensitivity: false });
  });
});

describe('applyFormSchema', () => {
  it('needs at least one group', () => {
    expect(applyFormSchema.safeParse({ groups: [], includeResolution: false, includeSensitivity: false }).success).toBe(false);
  });
});
