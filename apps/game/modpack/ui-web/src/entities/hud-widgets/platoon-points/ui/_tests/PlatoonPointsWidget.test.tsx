// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { platoonPointsSchema } from '../../model/schemas';
import { PlatoonPointsWidget } from '../PlatoonPointsWidget';

const data = platoonPointsSchema.parse(readWidgetFixture('platoon_points'));

describe(PlatoonPointsWidget, () => {
  it('shows the total of the platoon', () => {
    const html = mount({ Component: PlatoonPointsWidget, props: { data } });

    expect(html.textContent).toContain('34');
  });

  it('shows a row per platoon member with its name and class icon', () => {
    const html = mount({ Component: PlatoonPointsWidget, props: { data } });

    expect(html.textContent).toContain('Союзник');
    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/green/heavyTank.png');
  });
});
