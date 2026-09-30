// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { MARKS_PANEL } from '../../config';
import { marksPanelSchema } from '../../model/schemas';
import { MarksPanelWidget } from '../MarksPanelWidget';

const sources = (html: HTMLElement) => [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

const data = marksPanelSchema.parse(readWidgetFixture('marks_panel'));

const compact = { ...data, style: 'compact' as const, thresholds: [], step: null, average: null, battles: null };

const rows = (html: HTMLElement) => html.firstElementChild?.children ?? [];

describe(MarksPanelWidget, () => {
  it('shows the client marks icon', () => {
    const html = render(<MarksPanelWidget data={data} />).container;

    expect(sources(html)).toEqual(['img://gui/maps/icons/library/marksOnGun/mark_2.png']);
  });

  it('keeps the main row on top and grows the detail rows under it', () => {
    const html = render(<MarksPanelWidget data={data} />).container;

    expect(rows(html)[0]?.textContent).toContain('86,30');
    expect(rows(html)[1]?.textContent).toContain('25 195');
    expect(rows(html)[2]?.textContent).toContain('2 551');
  });

  it('shows the next goal on the main row', () => {
    const html = render(<MarksPanelWidget data={compact} />).container;

    expect(html.textContent).toContain('87 %2 107');
  });

  it('keeps the compact style to one row', () => {
    const html = render(<MarksPanelWidget data={compact} />).container;

    expect(rows(html)).toHaveLength(1);
  });

  it('marks an estimated percent', () => {
    const html = render(<MarksPanelWidget data={{ ...compact, estimated: true }} />).container;

    expect(html.textContent).toContain(MARKS_PANEL.approx);
  });

  it('says so when the tank has no thresholds', () => {
    const empty = { ...compact, has_curve: false, delta: null, goal: null, note: 'нет порогов' };
    const html = render(<MarksPanelWidget data={empty} />).container;

    expect(html.textContent).toContain('нет порогов');
  });

  it('draws a custom template as its text alone', () => {
    const custom = { ...compact, style: 'custom' as const, text: '86.12 / 95' };
    const html = render(<MarksPanelWidget data={custom} />).container;

    expect(html.textContent).toBe('86.12 / 95');
  });
});
