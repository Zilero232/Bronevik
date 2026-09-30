// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { TeamHpData } from '../../model/schemas';

import { readWidgetFixture } from '../../../../../shared/lib/testing/widget-fixture';
import { teamHpSchema } from '../../model/schemas';
import { TeamHpWidget } from '../TeamHpWidget';

const sources = (html: HTMLElement) => [...html.querySelectorAll('img')].map((image) => image.getAttribute('src'));

const fixture = teamHpSchema.parse(readWidgetFixture('team_hp'));

const mount = (data: TeamHpData): HTMLElement => render(<TeamHpWidget data={data} />).container;

describe(TeamHpWidget, () => {
  it('draws the icon strip from the Python fixture with class icons of both sides', () => {
    const html = mount(fixture);

    expect(sources(html)).toContain('img://gui/maps/icons/vehicleTypes/green/mediumTank.png');
    expect(sources(html)).toContain('img://gui/maps/icons/vehicleTypes/red/at-spg.png');
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

  it('puts the difference under the score, in the row of the bars', () => {
    const html = mount({ ...fixture, style: 'full' });

    const diff = [...html.querySelectorAll('span')].find((span) => span.textContent?.startsWith('Δ'));

    expect(diff?.parentElement?.textContent).toContain('2 : 1');
    expect(diff?.parentElement?.parentElement).toBe(html.firstElementChild?.firstElementChild);
  });

  it('draws one row for a style without the icon strip', () => {
    const html = mount({ ...fixture, style: 'full' });

    expect(html.firstElementChild?.children).toHaveLength(1);
  });

  it('leaves the numbers out of the minimal style', () => {
    const html = mount({ ...fixture, style: 'minimal' });

    expect(html.textContent).not.toContain('3 200');
  });
});
