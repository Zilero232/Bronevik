import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { FORMATS, messages } from '@/shared/i18n';

import { SETTINGS_FORMAT } from '../../../../config';
import { useSettingsFormatter } from '../use-settings-formatter';

const T = messages.en.streamerSettings;

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider formats={FORMATS} locale='en' messages={messages.en} timeZone='UTC'>
    {children}
  </NextIntlClientProvider>
);

const formatter = () => renderHook(() => useSettingsFormatter(), { wrapper }).result.current;

describe('useSettingsFormatter', () => {
  it('labels a group key as a group and a field path as a field', () => {
    const { label } = formatter();

    expect(label('display')).toBe(T.groups.display);
    expect(label('display.windowMode')).toBe(T.fields.display_windowMode);
  });

  it('translates a known option and leaves free text as typed', () => {
    const { optionLabel } = formatter();

    expect(optionLabel('borderless')).toBe(T.options.borderless);
    expect(optionLabel('My custom preset')).toBe('My custom preset');
  });

  it('renders an enum value through its option label', () => {
    expect(formatter().valueParts({ path: 'display.windowMode', value: 'windowed' })).toEqual({ items: [T.options.windowed], isList: false });
  });

  it('renders a number with its unit', () => {
    expect(formatter().valueText({ path: 'display.refreshRate', value: 144 })).toBe('144 Hz');
  });

  it('keeps sensitivity at fixed precision', () => {
    expect(formatter().valueText({ path: 'controls.sensitivity.sniper', value: 0.5 })).toBe('0.50');
  });

  it('lists a multi-choice value item by item', () => {
    const parts = formatter().valueParts({ path: 'zoom.steps', value: 'x2, x4, x8' });

    expect(parts.isList).toBe(true);
    expect(parts.items).toHaveLength(3);
  });

  it('joins list items with the list separator in plain text', () => {
    const { valueParts, valueText } = formatter();
    const row = { path: 'zoom.steps', value: 'x2, x4' };

    expect(valueText(row)).toBe(valueParts(row).items.join(SETTINGS_FORMAT.listSeparator));
  });

  it('shows a placeholder for a missing value', () => {
    expect(formatter().valueText({ path: 'display.resolution', value: null })).toBe(SETTINGS_FORMAT.missing);
  });

  it('names where the settings came from and when they were checked', () => {
    const { sourceLabel, checkedText } = formatter();

    expect(sourceLabel('mod')).toBe(T.sources.mod);
    expect(checkedText('2026-09-05T10:00:00Z')).toContain('2026');
  });
});
