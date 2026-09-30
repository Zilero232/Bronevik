// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { platoonPointsSchema } from '../../model/schemas';
import { PlatoonPointsWidget } from '../PlatoonPointsWidget';

const sources = (html: HTMLElement) => [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

const data = platoonPointsSchema.parse(readWidgetFixture('platoon_points'));

describe(PlatoonPointsWidget, () => {
  it('shows the total of the platoon', () => {
    const html = render(<PlatoonPointsWidget data={data} />).container;

    expect(html.textContent).toContain('34');
  });

  it('shows a row per platoon member with its name and class icon', () => {
    const html = render(<PlatoonPointsWidget data={data} />).container;

    expect(html.textContent).toContain('Союзник');
    expect(sources(html)).toContain('img://gui/maps/icons/vehicleTypes/green/heavyTank.png');
  });
});
