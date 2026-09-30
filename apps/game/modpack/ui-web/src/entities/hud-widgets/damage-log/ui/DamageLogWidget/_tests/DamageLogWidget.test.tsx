// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { imageSources, mount } from '../../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../../shared/lib/testing/widget-fixture';
import { damageLogSchema } from '../../../model/schemas';
import { DamageLogWidget } from '../DamageLogWidget';

const fixture = damageLogSchema.parse(readWidgetFixture('damage_log'));

const withNote = (note: string) => fixture.rows.map((row) => ({ ...row, note }));

describe(DamageLogWidget, () => {
  it('draws the totals as an icon and a number', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: fixture } });

    expect(imageSources(html)).toContain('img://gui/maps/icons/library/efficiency/48x48/damage.png');
  });

  it('draws one row per hit with its shell and attacker, received ones with a minus', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: fixture } });

    expect(imageSources(html)).toContain('img://gui/maps/icons/shell/small/ARMOR_PIERCING_CR_PREMIUM.png');
    expect(html.textContent).toContain('-310');
    expect(html.textContent).toContain('KV-1');
  });

  it('draws the hit glyphs as inline icons', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: fixture } });

    expect(html.querySelectorAll('svg').length).toBeGreaterThan(0);
  });

  it('keeps the compact style to the totals', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: { ...fixture, style: 'compact' as const, rows: [] } } });

    expect(html.textContent).not.toContain('KV-1');
    expect(html.textContent).toContain('710');
  });

  it('keeps a short row to the amount and its icon while Alt is up', () => {
    const html = mount({ Component: DamageLogWidget, props: { data: { ...fixture, detail: 'short' as const } } });

    expect(html.textContent).toContain('-310');
    expect(html.textContent).not.toContain('KV-1');
    expect(imageSources(html)).not.toContain('img://gui/maps/icons/vehicleTypes/white/heavyTank.png');
  });

  it('keeps the full row and adds its note while Alt is held', () => {
    const data = { ...fixture, detail: 'extended' as const, rows: withNote('Получено ОФ боеукладка') };

    const html = mount({ Component: DamageLogWidget, props: { data } });

    expect(html.textContent).toContain('KV-1');
    expect(html.textContent).toContain('Получено ОФ боеукладка');
  });
});
