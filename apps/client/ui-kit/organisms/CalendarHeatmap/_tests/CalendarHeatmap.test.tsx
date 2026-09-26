import type { ReactElement } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';

import { messages } from '@/shared/i18n';

import type { HeatmapDay } from '../CalendarHeatmap.types';

import { CalendarHeatmap } from '../CalendarHeatmap';
import { CALENDAR_HEATMAP } from '../CalendarHeatmap.constants';

const LABEL = 'Battles per day';
const PEAK = '2026-09-03';
const QUIET = '2026-09-02';

const DAYS: HeatmapDay[] = [
  { date: '2026-08-31', value: 2 },
  { date: '2026-09-01', value: 5 },
  { date: QUIET, value: 0 },
  { date: PEAK, value: 20 },
  { date: '2026-09-04', value: 10 }
];

const readout = (day: HeatmapDay | null) => (day ? `${day.date}: ${day.value}` : 'none');

const renderWithIntl = (ui: ReactElement) =>
  render(
    <NextIntlClientProvider locale='en' messages={messages.en} timeZone='UTC'>
      {ui}
    </NextIntlClientProvider>
  );

const cells = () => [...screen.getByRole('img', { name: LABEL }).children].filter((node) => node.hasAttribute('data-level'));

const readoutNode = () => screen.getByText(/^(none|\d{4}-\d{2}-\d{2}: \d+)$/);

const levelsByDate = () => {
  const levels = new Map<string, number>();

  for (const cell of cells()) {
    fireEvent.pointerEnter(cell);
    const text = readoutNode().textContent ?? '';

    if (text !== 'none') {
      levels.set(text.split(':')[0], Number(cell.getAttribute('data-level')));
    }
  }

  return levels;
};

describe('CalendarHeatmap', () => {
  it('exposes the grid as a single labelled image', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    expect(screen.getByRole('img', { name: LABEL })).toBeInTheDocument();
  });

  it('reads out the hovered day and clears it when the pointer leaves', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const levels = levelsByDate();

    expect([...levels.keys()].sort()).toEqual(DAYS.map((day) => day.date).sort());

    fireEvent.pointerLeave(cells()[0]);

    expect(readoutNode()).toHaveTextContent('none');
  });

  it('gives the busiest day the top level and an idle day the bottom one', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const levels = levelsByDate();

    expect(levels.get(PEAK)).toBe(CALENDAR_HEATMAP.levels - 1);
    expect(levels.get(QUIET)).toBe(0);
  });

  it('never ranks a busier day below a quieter one', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const levels = levelsByDate();
    const ordered = [...DAYS].sort((a, b) => a.value - b.value).map((day) => levels.get(day.date) ?? -1);

    expect(ordered).toEqual([...ordered].sort((a, b) => a - b));
  });

  it('labels the months it spans in the current locale', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    expect(screen.getByText('Sep')).toBeInTheDocument();
  });

  it('draws one legend swatch per level between the legend labels', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} legend={{ less: 'Less', more: 'More' }} levels={4} />);

    const legend = screen.getByText(/Less/).closest('span');

    expect(legend).toHaveTextContent(/Less.*More/);
    expect(legend?.querySelectorAll('[data-level]')).toHaveLength(4);
  });

  it('renders an empty grid for no days', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={[]} />);

    expect(screen.getByRole('img', { name: LABEL })).toBeEmptyDOMElement();
  });
});
