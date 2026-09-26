import type { SettingsValues } from '@otmetki/schemas';

import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { SETTINGS_FIELDS } from '@/entities/streamer/settings';

import { SETTINGS_FORM } from '../../../config';
import { mergeSettings, readPath, toSettingsFormValues } from '../settings-form';
import { settingsFormSchema } from '../settings-form.schemas';

const VALUES: SettingsValues = {
  display: { resolution: '1920x1080', refreshRate: 144, preset: 'medium', vsync: false, overrides: { shadows: 'high' } },
  camera: { fov: 95, dynamicFov: [80, 100] },
  controls: { sensitivity: { sniper: 0.32 } },
  zoom: { steps: ['x2', 'x4', 'x8'] }
};

describe('toSettingsFormValues', () => {
  const form = toSettingsFormValues(VALUES);

  it('gives every editable field a controlled value', () => {
    for (const field of SETTINGS_FIELDS) {
      expect(readPath(form, field.path)).not.toBeUndefined();
    }
  });

  it('marks missing enum and boolean fields as unset, keeping false apart from unset', () => {
    expect(readPath(form, 'display.windowMode')).toBe(SETTINGS_FORM.unset);
    expect(readPath(form, 'display.tripleBuffering')).toBe(SETTINGS_FORM.unset);
    expect(readPath(form, 'display.vsync')).toBe(String(false));
  });
});

describe('settingsFormSchema', () => {
  it('round-trips the editable values', () => {
    const { display, camera, controls, zoom } = settingsFormSchema.parse(toSettingsFormValues(VALUES));

    expect(display).toEqual({ resolution: '1920x1080', refreshRate: 144, preset: 'medium', vsync: false });
    expect(camera).toEqual({ fov: 95 });
    expect(controls).toEqual(VALUES.controls);
    expect(zoom).toEqual(VALUES.zoom);
  });

  it('turns an untouched form into no groups at all', () => {
    expect(settingsFormSchema.parse(toSettingsFormValues({}))).toEqual({});
  });

  it('drops blank text and keeps the group only when something is left', () => {
    const form = toSettingsFormValues({ hardware: { gpu: 'x' } });

    form.hardware.gpu = '   ';

    expect(settingsFormSchema.parse(form)).toEqual({});
  });

  it('reports an out-of-range value on the field path', () => {
    const form = toSettingsFormValues({});

    form.camera.fov = STREAMER_SETTINGS.fov.max + 1;

    expect(settingsFormSchema.safeParse(form).error?.issues.map((issue) => issue.path.join('.'))).toEqual(['camera.fov']);
  });
});

describe('mergeSettings', () => {
  it('keeps values the form does not edit and replaces the ones it does', () => {
    const merged = mergeSettings({ base: VALUES, edited: { display: { resolution: '2560x1440' } } });

    expect(merged.display).toEqual({ resolution: '2560x1440', overrides: VALUES.display?.overrides });
    expect(merged.camera).toEqual({ dynamicFov: VALUES.camera?.dynamicFov });
    expect(merged.controls).toBeUndefined();
    expect(merged.zoom).toBeUndefined();
  });
});
