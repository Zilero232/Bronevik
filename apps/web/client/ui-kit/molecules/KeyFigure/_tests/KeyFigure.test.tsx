import type { ReactElement } from 'react';

import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { FORMATS } from '@/shared/i18n';

import { KeyFigure } from '../KeyFigure';

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider formats={FORMATS} locale='en' messages={{}} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

describe('KeyFigure', () => {
  it('shows a dash for a missing value', () => {
    renderWithIntl(<KeyFigure label='WN8' value={null} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('wraps a text value in its prefix and suffix', () => {
    renderWithIntl(<KeyFigure label='Win rate' prefix='~' suffix='%' value='54.2' />);

    expect(screen.getByText('~54.2%')).toBeInTheDocument();
  });

  it('renders a node value as given', () => {
    renderWithIntl(<KeyFigure label='Rank' value={<strong>Top 1</strong>} />);

    expect(screen.getByText('Top 1').tagName).toBe('STRONG');
  });

  it('signs a positive delta', () => {
    renderWithIntl(<KeyFigure delta={12} label='WN8' value='2400' />);

    expect(screen.getByText('+12')).toBeInTheDocument();
  });

  it('shows an unchanged delta as zero when no label explains it', () => {
    renderWithIntl(<KeyFigure delta={0} label='WN8' value='2400' />);

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('lets the delta label speak for an unchanged delta', () => {
    renderWithIntl(<KeyFigure delta={0} deltaLabel='no change this week' label='WN8' value='2400' />);

    expect(screen.getByText('no change this week')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });
});
