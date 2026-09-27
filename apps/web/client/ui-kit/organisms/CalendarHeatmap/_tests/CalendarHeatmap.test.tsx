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

const cells = () => [...screen.getByRole('group', { name: LABEL }).children].filter((node) => node.hasAttribute('data-level'));

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
  it('exposes the grid as a labelled group with one labelled image per day', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    expect(screen.getByRole('group', { name: LABEL })).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(DAYS.length);
    expect(screen.getByRole('img', { name: 'September 3, 2026' })).toBeInTheDocument();
  });

  it('reads out the days from the keyboard with a single tab stop', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const focusable = cells().filter((cell) => cell.getAttribute('tabindex') === '0');

    expect(focusable).toHaveLength(1);

    fireEvent.focus(focusable[0]);

    expect(readoutNode()).toHaveTextContent('2026-09-04: 10');

    fireEvent.keyDown(focusable[0], { key: 'ArrowUp' });

    expect(readoutNode()).toHaveTextContent(`${PEAK}: 20`);
    expect(document.activeElement).toHaveAttribute('data-date', PEAK);

    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Home' });

    expect(readoutNode()).toHaveTextContent('2026-08-31: 2');
  });

  it('reads out the hovered day and clears it when the pointer leaves', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const levels = levelsByDate();

    expect([...levels.keys()].sort()).toEqual(DAYS.map((day) => day.date).sort());

    fireEvent.pointerLeave(cells()[0]);

    expect(readoutNode()).toHaveTextContent('none');
  });

  it('keeps a tapped day read out when a touch pointer leaves it', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const peak = screen.getByRole('img', { name: 'September 3, 2026' });

    fireEvent.pointerEnter(peak);
    fireEvent.pointerLeave(peak, { pointerType: 'touch' });

    expect(readoutNode()).toHaveTextContent(`${PEAK}: 20`);
  });

  it('leaves keys other than navigation to the browser', () => {
    renderWithIntl(<CalendarHeatmap ariaLabel={LABEL} days={DAYS} renderReadout={readout} />);

    const [focusable] = cells().filter((cell) => cell.getAttribute('tabindex') === '0');

    fireEvent.focus(focusable);

    expect(fireEvent.keyDown(focusable, { key: 'Tab' })).toBe(true);
    expect(fireEvent.keyDown(focusable, { key: 'ArrowUp' })).toBe(false);
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

    expect(screen.getByRole('group', { name: LABEL })).toBeEmptyDOMElement();
  });
});
