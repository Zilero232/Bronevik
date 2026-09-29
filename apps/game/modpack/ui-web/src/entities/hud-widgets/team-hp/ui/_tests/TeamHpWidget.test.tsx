// @vitest-environment jsdom
import { h, render } from 'preact';
import { describe, expect, it } from 'vitest';

import type { TeamHpData } from '../../model/schemas';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { teamHpSchema } from '../../model/schemas';
import { TeamHpWidget } from '../TeamHpWidget';

const fixture = teamHpSchema.parse(readWidgetFixture('team_hp'));

const mount = (data: TeamHpData): HTMLElement => {
  const container = document.createElement('div');

  render(h(TeamHpWidget, { data }), container);

  return container;
};

describe(TeamHpWidget, () => {
  it('draws the icon strip from the Python fixture with class icons of both sides', () => {
    const html = mount(fixture);
    const images = [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

    expect(images).toContain('img://gui/maps/icons/vehicleTypes/green/mediumTank.png');
    expect(images).toContain('img://gui/maps/icons/vehicleTypes/red/at-spg.png');
    expect(html.textContent).toContain('2 : 1');
  });

  it('shows the numbers and the difference in the bar pair style', () => {
    const html = mount({ ...fixture, style: 'full', vehicles: { allies: [], enemies: [] } });

    expect(html.textContent).toContain('3 200');
    expect(html.textContent).toContain('Δ +2 300');
    expect(html.querySelectorAll('img')).toHaveLength(0);
  });

  it('leaves the numbers out of the minimal style', () => {
    expect(mount({ ...fixture, style: 'minimal' }).textContent).not.toContain('3 200');
  });
});
