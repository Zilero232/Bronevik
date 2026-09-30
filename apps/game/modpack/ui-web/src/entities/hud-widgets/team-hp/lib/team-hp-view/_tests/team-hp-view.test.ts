import { describe, expect, it } from 'vitest';

import type { TeamHpData, TeamHpVehicle } from '../../../model/schemas';

import { TEAM_HP } from '../../../config';
import { teamHpView } from '../team-hp-view';

const vehicle = (max: number, hp: number, tier: string | null = null): TeamHpVehicle => ({ icon: null, tier, hp, max, alive: hp > 0 });

const data = (style: TeamHpData['style']): TeamHpData => ({
  style,
  allies: { hp: 3200, max: 5300, alive: 2, count: 3, frags: 2 },
  enemies: { hp: 900, max: 5200, alive: 1, count: 3, frags: 1 },
  show_score: true,
  score_alive: false,
  diff: 2300,
  colors: { ally: '#7CD35B', enemy: '#E3564A' },
  vehicles: {
    allies: [vehicle(1800, 1200), vehicle(1500, 0)],
    enemies: [vehicle(1700, 900)]
  }
});

const tiered = (style: TeamHpData['style']): TeamHpData => ({
  ...data(style),
  vehicles: {
    allies: [vehicle(2000, 2000, 'X'), vehicle(1800, 1200), vehicle(1500, 0, 'IX')],
    enemies: [vehicle(1700, 900, 'X'), vehicle(1600, 0, 'IX')]
  }
});

const withAlliesAlive = (alive: number): TeamHpData => ({ ...data('full'), allies: { ...data('full').allies, alive } });

const enemiesOnly = (style: TeamHpData['style'], enemies: TeamHpVehicle[]): TeamHpData => ({
  ...data(style),
  vehicles: { allies: [], enemies }
});

const stripLabels = (strip: ReturnType<typeof teamHpView>['allies']['strip']) => strip.map((item) => (item.kind === 'tier' ? item.label : item.kind));

describe(teamHpView, () => {
  it('shows the numbers, the bars, the frag score and the signed difference in the full style', () => {
    const view = teamHpView(data('full'));

    expect(view).toMatchObject({ showNumbers: true, showBars: true, showStrip: false, score: '2 : 1', diff: '+2 300', diffAhead: true });
  });

  it('fills the bar by the share of HP left and writes the HP', () => {
    const view = teamHpView(data('full'));

    expect(view.allies.fill).toBe(97);
    expect(view.allies.hp).toBe('3 200');
  });

  it('keeps the frags in the score without the alive toggle', () => {
    const view = teamHpView(withAlliesAlive(3));

    expect(view.score).toBe('2 : 1');
  });

  it('puts the alive count, not the frags, in the score once toggled', () => {
    const view = teamHpView({ ...withAlliesAlive(3), score_alive: true });

    expect(view.score).toBe('3 : 1');
  });

  it('splits the bar into one segment per tank, sized by its max HP', () => {
    const { enemies } = teamHpView(enemiesOnly('segments', [vehicle(1800, 1200), vehicle(1500, 0)]));

    expect(enemies.segments).toMatchObject([
      { kind: 'segment', width: 103 },
      { kind: 'segment', width: 86, fill: 0, alive: false }
    ]);
  });

  it('draws the allied segments from the centre outwards', () => {
    const { allies } = teamHpView(data('segments'));

    expect(allies.segments.map((item) => item.kind === 'segment' && item.alive)).toEqual([false, true]);
  });

  it('parts the segments of two tiers with a gap', () => {
    const { enemies } = teamHpView(tiered('segments'));

    expect(enemies.segments.map((item) => item.kind)).toEqual(['segment', 'gap', 'segment']);
  });

  it('labels each tier group of the strip on its centre side', () => {
    const { allies, enemies } = teamHpView(tiered('icons'));

    expect(stripLabels(enemies.strip)).toEqual(['X', 'vehicle', 'IX', 'vehicle']);
    expect(stripLabels(allies.strip)).toEqual(['vehicle', 'IX', 'vehicle', 'vehicle', 'X']);
  });

  it('dims the dead in the icon strip', () => {
    const { enemies } = teamHpView(enemiesOnly('icons', [vehicle(1500, 0)]));

    expect(enemies.strip[0]).toMatchObject({ alpha: TEAM_HP.deadAlpha, bar: 0 });
  });

  it('keeps the compact style to one line without bars or the difference', () => {
    const view = teamHpView(data('compact'));

    expect(view).toMatchObject({ showBars: false, diff: null, compact: true });
  });

  it('keeps the minimal style to thin bars without numbers', () => {
    const view = teamHpView(data('minimal'));

    expect(view).toMatchObject({ showNumbers: false, barHeight: TEAM_HP.barHeight.thin });
  });
});
