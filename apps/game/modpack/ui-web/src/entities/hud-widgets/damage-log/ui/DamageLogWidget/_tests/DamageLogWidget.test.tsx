// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { damageLogSchema } from '../../../model/schemas';
import { DamageLogWidget } from '../DamageLogWidget';

const fixture = damageLogSchema.parse(readWidgetFixture('damage_log'));

describe(DamageLogWidget, () => {
  it('draws totals as icon and number and one row per hit, received ones with a minus', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: fixture } });

    expect(imageSources(html)).toContain('img://gui/maps/icons/library/efficiency/48x48/damage.png');
    expect(imageSources(html)).toContain('img://gui/maps/icons/shell/small/ARMOR_PIERCING_CR_PREMIUM.png');
    expect(html.textContent).toContain('-310');
    expect(html.textContent).toContain('KV-1');
    expect(html.querySelectorAll('svg').length).toBeGreaterThan(0);
  });

  it('keeps the compact style to the totals', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: { ...fixture, style: 'compact' as const, rows: [] } } });

    expect(html.textContent).not.toContain('KV-1');
    expect(html.textContent).toContain('710');
  });
});
