import type { ReactNode } from 'react';

import { renderHook } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { FORMATS, messages } from '@/shared/i18n';

import { TANK_SPEC_KEYS } from '../../../../config';
import { useSpecFormat } from '../use-spec-format';

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider formats={FORMATS} locale='en' messages={messages.en} timeZone='UTC'>
    {children}
  </NextIntlClientProvider>
);

const specFormat = () => renderHook(() => useSpecFormat(), { wrapper }).result.current;

describe('useSpecFormat', () => {
  it('shows a dash for a missing value', () => {
    const { value } = specFormat();

    expect(value({ key: 'shellDamage', value: null })).toBe('—');
    expect(value({ key: 'shellDamage', value: undefined })).toBe('—');
  });

  it('formats zero as a real value, not as missing', () => {
    expect(specFormat().value({ key: 'shellDamage', value: 0 })).toBe('0');
  });

  it('rounds whole-number specs and groups thousands', () => {
    expect(specFormat().value({ key: 'maxHealth', value: 2150.4 })).toBe('2,150');
  });

  it('keeps the spec precision for fine-grained specs', () => {
    const { value } = specFormat();

    expect(value({ key: 'dispersion', value: 0.3456 })).toBe('0.346');
    expect(value({ key: 'reloadTime', value: 7 })).toBe('7.0');
  });

  it('falls back to two decimals for an unknown spec', () => {
    expect(specFormat().value({ key: 'mysterySpec', value: 1.23456 })).toBe('1.23');
  });

  it('names the unit of a spec and leaves unitless specs bare', () => {
    const { unit } = specFormat();

    expect(unit('shellPenetration')).toBe(messages.en.tank.units.mm);
    expect(unit('damagePerMinute')).toBe('');
    expect(unit('mysterySpec')).toBe('');
  });

  it('has a translated label for every spec', () => {
    const { label } = specFormat();

    for (const key of TANK_SPEC_KEYS) {
      expect(label(key)).toBe(messages.en.tank.specs[key]);
    }
  });
});
