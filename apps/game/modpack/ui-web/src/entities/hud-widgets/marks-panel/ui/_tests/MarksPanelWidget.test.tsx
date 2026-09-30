// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { marksPanelSchema } from '../../model/schemas';
import { MarksPanelWidget } from '../MarksPanelWidget';

const sources = (html: HTMLElement) => [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

const data = marksPanelSchema.parse(readWidgetFixture('marks_panel'));

const compact = { ...data, style: 'compact' as const };

describe(MarksPanelWidget, () => {
  it('shows the client marks icon', () => {
    const html = render(<MarksPanelWidget data={data} />).container;

    expect(sources(html)).toEqual(['img://gui/maps/icons/library/marksOnGun/mark_2.png']);
  });

  it('shows the percent and the thresholds', () => {
    const html = render(<MarksPanelWidget data={data} />).container;

    expect(html.textContent).toContain('86,30');
    expect(html.textContent).toContain('95 %');
  });

  it('shows the average line in the Alt view', () => {
    const html = render(<MarksPanelWidget data={data} />).container;

    expect(html.textContent).toContain('2 540 › 2 551');
  });

  it('keeps the compact style to one line', () => {
    const html = render(<MarksPanelWidget data={compact} />).container;

    expect(html.textContent).not.toContain('25 195');
    expect(html.textContent).not.toContain('среднее');
  });

  it('keeps the next whole percent and the badge in the compact style', () => {
    const html = render(<MarksPanelWidget data={compact} />).container;

    expect(html.textContent).toContain('87 %2 107');
    expect(html.textContent).toContain('проверено');
  });
});
