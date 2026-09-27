import settings from '@contract/settings.json';
import { describe, expect, it } from 'vitest';

import { managerSettingsSchema, SETTINGS } from '@/entities/settings';

describe('managerSettingsSchema', () => {
  it('parses the settings file with its defaults', () => {
    const parsed = managerSettingsSchema.parse(settings);

    expect(parsed.autostart).toBe(true);
    expect(SETTINGS.checkIntervals.map((option) => option.minutes)).toContain(parsed.checkIntervalMinutes);
  });
});
