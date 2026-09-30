// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { marksPanelSchema } from '../../model/schemas';
import { MarksPanelWidget } from '../MarksPanelWidget';

const data = marksPanelSchema.parse(readWidgetFixture('marks_panel'));

describe(MarksPanelWidget, () => {
  it('shows the marks icon, the percent and the thresholds', () => {
    const html = mount({ Component: MarksPanelWidget, props: { data } });

    expect(imageSources(html)).toEqual(['img://gui/maps/icons/library/marksOnGun/mark_2.png']);
    expect(html.textContent).toContain('86,30');
    expect(html.textContent).toContain('95 %');
  });

  it('shows the average line in the Alt view', () => {
    const html = mount({ Component: MarksPanelWidget, props: { data } });

    expect(html.textContent).toContain('2 540 › 2 551');
  });

  it('keeps the compact style to one line', () => {
    const html = mount({ Component: MarksPanelWidget, props: { data: { ...data, style: 'compact' as const } } });

    expect(html.textContent).not.toContain('25 195');
    expect(html.textContent).not.toContain('среднее');
  });

  it('keeps the next whole percent and the badge in the compact style', () => {
    const html = mount({ Component: MarksPanelWidget, props: { data: { ...data, style: 'compact' as const } } });

    expect(html.textContent).toContain('87 %2 107');
    expect(html.textContent).toContain('проверено');
  });
});
