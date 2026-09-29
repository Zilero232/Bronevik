// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { platoonPointsSchema } from '../../model/schemas';
import { PlatoonPointsWidget } from '../PlatoonPointsWidget';

describe(PlatoonPointsWidget, () => {
  it('shows the total and a row per platoon member with its HP bar, frags and points', () => {
    const data = platoonPointsSchema.parse(readWidgetFixture('platoon_points'));
    const html = mount({ Component: PlatoonPointsWidget, props: { data } });

    expect(html.textContent).toContain(String(data.total));
    expect(html.textContent).toContain('Союзник');
    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/green/heavyTank.png');
  });
});
