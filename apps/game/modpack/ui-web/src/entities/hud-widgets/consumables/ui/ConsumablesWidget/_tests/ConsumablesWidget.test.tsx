// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { consumablesSchema } from '../../../model/schemas';
import { ConsumablesWidget } from '../ConsumablesWidget';

describe(ConsumablesWidget, () => {
  it('draws the slots with their client icons, cooldown rings and the shell counts', () => {
    const html = mount({ Component: ConsumablesWidget, props: { data: consumablesSchema.parse(readWidgetFixture('consumables')) } });

    expect(imageSources(html)).toContain('img://gui/maps/icons/artefact/smallRepairkit.png');
    expect(imageSources(html)).toContain('img://gui/maps/icons/ammopanel/battle_ammo/ARMOR_PIERCING_CR_PREMIUM.png');
    expect(html.querySelectorAll('circle')).toHaveLength(6);
    expect(html.textContent).toContain('12');
    expect(html.textContent).toContain('32');
  });
});
