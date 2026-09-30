// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { consumablesSchema } from '../../../model/schemas';
import { ConsumablesWidget } from '../ConsumablesWidget';

const data = consumablesSchema.parse(readWidgetFixture('consumables'));

describe(ConsumablesWidget, () => {
  it('draws the slots and the shells with their client icons', () => {
    const html = mount({ Component: ConsumablesWidget, props: { data } });

    expect(imageSources(html)).toContain('img://gui/maps/icons/artefact/smallRepairkit.png');
    expect(imageSources(html)).toContain('img://gui/maps/icons/ammopanel/battle_ammo/ARMOR_PIERCING_CR_PREMIUM.png');
  });

  it('draws a cooldown ring per slot', () => {
    const html = mount({ Component: ConsumablesWidget, props: { data } });

    expect(html.querySelectorAll('circle')).toHaveLength(6);
  });

  it('shows the cooldown seconds and the shell counts', () => {
    const html = mount({ Component: ConsumablesWidget, props: { data } });

    expect(html.textContent).toContain('12');
    expect(html.textContent).toContain('32');
  });
});
