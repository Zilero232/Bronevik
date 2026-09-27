import type { ReactElement } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { RangeSlider } from '../RangeSlider';

const LIMITS = { min: 0, max: 100, step: 10 };

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={{}} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('RangeSlider', () => {
  it('reports a keyboard step as a single number', () => {
    const onValueChange = vi.fn<(value: number) => void>();

    renderWithIntl(<RangeSlider label='Share' {...LIMITS} value={50} onValueChange={onValueChange} />);

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });

    expect(onValueChange).toHaveBeenCalledWith(50 + LIMITS.step);
  });

  it('does not move past the maximum', () => {
    const onValueChange = vi.fn<(value: number) => void>();

    renderWithIntl(<RangeSlider label='Share' {...LIMITS} value={LIMITS.max} onValueChange={onValueChange} />);

    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('shows a custom value label instead of the raw value', () => {
    renderWithIntl(<RangeSlider label='Share' {...LIMITS} value={50} valueLabel='half' onValueChange={vi.fn()} />);

    expect(screen.getByText('half')).toBeInTheDocument();
  });
});
