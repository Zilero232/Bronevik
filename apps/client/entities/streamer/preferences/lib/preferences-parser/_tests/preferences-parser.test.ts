import { settingsValuesSchema, STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { parsePreferences } from '../preferences-parser';
import { INVALID_XML, PREFERENCES_XML, SECRET } from './preferences.fixture';

describe('parsePreferences', () => {
  const result = parsePreferences(PREFERENCES_XML);

  it('reads the whitelisted plain tags into settings values', () => {
    expect(result.values).toEqual({
      display: {
        resolution: '2560x1440',
        refreshRate: 165,
        windowMode: 'fullscreen',
        vsync: false,
        tripleBuffering: true,
        preset: STREAMER_SETTINGS.presets[2]
      },
      camera: { fov: 95, postMortem: true },
      controls: { sensitivity: { arcade: 0.46, sniper: 0.32 } }
    });
  });

  it('returns values the settings schema accepts', () => {
    expect(settingsValuesSchema.safeParse(result.values).success).toBe(true);
  });

  it('lists exactly the fields it found', () => {
    expect([...result.found].sort()).toEqual(
      [
        'camera.fov',
        'camera.postMortem',
        'controls.sensitivity.arcade',
        'controls.sensitivity.sniper',
        'display.preset',
        'display.refreshRate',
        'display.resolution',
        'display.tripleBuffering',
        'display.vsync',
        'display.windowMode'
      ].sort()
    );
  });

  it('never carries the login, the token or an encoded blob', () => {
    const output = JSON.stringify(result);

    for (const secret of Object.values(SECRET)) {
      expect(output).not.toContain(secret);
    }
  });

  it('skips a whitelisted tag that sits inside the login section', () => {
    expect(result.values.camera?.fov).not.toBe(111);
  });

  it('drops values that are malformed or out of range', () => {
    expect(parsePreferences(INVALID_XML)).toEqual({ values: {}, found: [] });
  });

  it('returns nothing for a file that is not xml', () => {
    expect(parsePreferences('not <xml')).toEqual({ values: {}, found: [] });
    expect(parsePreferences('')).toEqual({ values: {}, found: [] });
  });
});
