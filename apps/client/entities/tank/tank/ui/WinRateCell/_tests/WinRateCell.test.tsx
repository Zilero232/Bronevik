import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { WinRateCell } from '../WinRateCell';

const renderCell = (value: number | null) =>
  render(
    <NextIntlClientProvider locale='en' messages={{}}>
      <WinRateCell value={value} />
    </NextIntlClientProvider>
  );

describe('WinRateCell', () => {
  it('colours the win rate by its rating tone', () => {
    renderCell(40);

    expect(screen.getByText('40%').getAttribute('data-tone')).toBe('bad');
  });

  it('shows a dash without a tone when the win rate is unknown', () => {
    renderCell(null);

    expect(screen.getByText('—').hasAttribute('data-tone')).toBe(false);
  });
});
