// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { TeamHpData } from '../../model/schemas';

import { imageSources, mount as mountComponent } from '../../../../../shared/lib/testing/mount';
import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { teamHpSchema } from '../../model/schemas';
import { TeamHpWidget } from '../TeamHpWidget';

const fixture = teamHpSchema.parse(readWidgetFixture('team_hp'));

const mount = (data: TeamHpData): HTMLElement => mountComponent({ Component: TeamHpWidget, props: { data } });

describe(TeamHpWidget, () => {
  it('draws the icon strip from the Python fixture with class icons of both sides', () => {
    const html = mount(fixture);

    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/green/mediumTank.png');
    expect(imageSources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/at-spg.png');
  });

  it('shows the frag score', () => {
    const html = mount(fixture);

    expect(html.textContent).toContain('2 : 1');
  });

  it('labels the tier groups of the icon strip', () => {
    const html = mount(fixture);

    expect(html.textContent).toContain('VIII');
  });

  it('draws no class icons when the stock vehicle icons are off', () => {
    const vehicles = { allies: fixture.vehicles.allies.map((vehicle) => ({ ...vehicle, icon: null })), enemies: [] };

    const html = mount({ ...fixture, vehicles });

    expect(html.querySelectorAll('img')).toHaveLength(0);
  });

  it('shows the alive vehicles in the score with the alive toggle', () => {
    const html = mount({ ...fixture, score_alive: true, enemies: { ...fixture.enemies, alive: 0 } });

    expect(html.textContent).toContain('2 : 0');
  });

  it('shows the numbers and the difference without icons in the bar pair style', () => {
    const html = mount({ ...fixture, style: 'full', vehicles: { allies: [], enemies: [] } });

    expect(html.textContent).toContain('3 200');
    expect(html.textContent).toContain('Δ +2 300');
    expect(html.querySelectorAll('img')).toHaveLength(0);
  });

  it('leaves the numbers out of the minimal style', () => {
    const html = mount({ ...fixture, style: 'minimal' });

    expect(html.textContent).not.toContain('3 200');
  });
});
