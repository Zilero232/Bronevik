import type { ReactElement } from 'react';

import { MOE } from '@otmetki/ratings';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { MarksRing } from '../MarksRing';

const [, SECOND_MARK] = MOE.markPercents;

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={{}} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

const passedNotches = (container: HTMLElement) => container.querySelectorAll('line[data-passed="true"]').length;

describe('MarksRing', () => {
  it('exposes the percent as a labelled progress bar', () => {
    renderWithIntl(<MarksRing label='Marks of excellence' percent={SECOND_MARK} />);

    expect(screen.getByRole('progressbar', { name: 'Marks of excellence' })).toHaveAttribute('aria-valuenow', String(SECOND_MARK));
  });

  it('draws one notch per mark threshold', () => {
    const { container } = renderWithIntl(<MarksRing label='Marks' percent={0} />);

    expect(container.querySelectorAll('line')).toHaveLength(MOE.markPercents.length);
    expect(passedNotches(container)).toBe(0);
  });

  it('counts a notch as passed exactly on its threshold', () => {
    const below = renderWithIntl(<MarksRing label='Below' percent={SECOND_MARK - 0.01} />);
    const onThreshold = renderWithIntl(<MarksRing label='On' percent={SECOND_MARK} />);

    expect(passedNotches(onThreshold.container)).toBe(passedNotches(below.container) + 1);
  });

  it('passes every notch at the maximum', () => {
    const { container } = renderWithIntl(<MarksRing label='Marks' percent={MOE.maxPercent} />);

    expect(passedNotches(container)).toBe(MOE.markPercents.length);
  });
});
