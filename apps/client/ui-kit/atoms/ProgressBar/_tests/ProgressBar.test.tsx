import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { ProgressBar } from '../ProgressBar';

const LOCALE = 'ru';

const wrapper = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale={LOCALE} messages={{}} timeZone='UTC'>
    {children}
  </NextIntlClientProvider>
);

describe('ProgressBar', () => {
  it('reports its value to assistive technology', () => {
    render(<ProgressBar label='Отметка' max={200} value={50} />, { wrapper });

    const bar = screen.getByRole('progressbar');

    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemax', '200');
  });

  it('formats its value text in the app locale rather than the runtime default', () => {
    render(<ProgressBar label='Отметка' max={200} value={50} />, { wrapper });

    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', new Intl.NumberFormat(LOCALE, { style: 'percent' }).format(50 / 200));
  });

  it('shows the label and the formatted value', () => {
    render(<ProgressBar label='Отметка' value={87.4} valueLabel='87.4%' />, { wrapper });

    expect(screen.getByText('Отметка')).toBeInTheDocument();
    expect(screen.getByText('87.4%')).toBeInTheDocument();
  });

  it('exposes the tone for styling', () => {
    render(<ProgressBar tone='unicum' value={10} />, { wrapper });

    expect(screen.getByRole('progressbar')).toHaveAttribute('data-tone', 'unicum');
  });
});
