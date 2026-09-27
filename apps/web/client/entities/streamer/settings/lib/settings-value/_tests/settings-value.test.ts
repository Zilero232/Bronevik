import { STREAMER_SETTINGS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { SETTINGS_FIELDS, SETTINGS_FORMAT } from '../../../config';
import { fieldMessage, isSettingsGroup, settingsOption, settingsValueView } from '../settings-value';

const withUnit = SETTINGS_FIELDS.find((field) => 'unit' in field);

describe('settingsValueView', () => {
  it('maps booleans to on/off options', () => {
    expect(settingsValueView({ path: 'display.vsync', value: true })).toEqual({ kind: 'options', options: ['true'], isList: false });
    expect(settingsValueView({ path: 'display.vsync', value: false })).toEqual({ kind: 'options', options: ['false'], isList: false });
  });

  it('keeps the unit of a numeric field', () => {
    expect(withUnit).toBeDefined();

    const view = settingsValueView({ path: withUnit?.path ?? '', value: 1 });

    expect(view).toMatchObject({ kind: 'number', value: 1, unit: withUnit && 'unit' in withUnit ? withUnit.unit : null });
  });

  it('fixes sensitivity digits', () => {
    expect(settingsValueView({ path: 'controls.sensitivity.sniper', value: 0.3 })).toMatchObject({
      kind: 'number',
      digits: SETTINGS_FORMAT.sensitivityDigits
    });
  });

  it('turns a known enum value into an option and leaves free text alone', () => {
    const [preset] = STREAMER_SETTINGS.presets;

    expect(settingsValueView({ path: 'display.preset', value: preset })).toEqual({ kind: 'options', options: [preset], isList: false });
    expect(settingsValueView({ path: 'hardware.gpu', value: 'medium' })).toEqual({ kind: 'text', text: 'medium' });
  });

  it('splits a multi field into options', () => {
    const steps = STREAMER_SETTINGS.zoomSteps.slice(0, 2);

    expect(settingsValueView({ path: 'zoom.steps', value: steps.join(SETTINGS_FORMAT.listSeparator) })).toEqual({
      kind: 'options',
      options: steps,
      isList: true
    });
  });

  it('shows missing values as a dash', () => {
    expect(settingsValueView({ path: 'camera.fov', value: null })).toEqual({ kind: 'text', text: SETTINGS_FORMAT.missing });
  });
});

describe('settingsOption', () => {
  it('knows every option a field declares', () => {
    for (const field of SETTINGS_FIELDS) {
      if ('options' in field) {
        for (const option of field.options) {
          expect(settingsOption(option)).toBe(option);
        }
      }
    }
  });

  it('rejects unknown values', () => {
    expect(settingsOption('RTX 4090')).toBeNull();
  });
});

describe('isSettingsGroup and fieldMessage', () => {
  it('tells groups from field paths', () => {
    expect(STREAMER_SETTINGS.groups.every(isSettingsGroup)).toBe(true);
    expect(isSettingsGroup('camera.fov')).toBe(false);
    expect(fieldMessage('camera.fov')).toBe('camera_fov');
  });
});
