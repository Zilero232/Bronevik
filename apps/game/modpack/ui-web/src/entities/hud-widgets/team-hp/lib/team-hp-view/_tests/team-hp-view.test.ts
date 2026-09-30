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

describe(teamHpView, () => {
  it('fills the bar pair by the share of HP left and signs the difference', () => {
    const view = teamHpView(data('full'));

    expect(view).toMatchObject({ showNumbers: true, showBars: true, showStrip: false, score: '2 : 1', diff: '+2 300', diffAhead: true });
    expect(view.allies.fill).toBe(Math.round((3200 / 5300) * TEAM_HP.barWidth.full));
    expect(view.allies.hp).toBe('3 200');
  });

  it('keeps the frags in the score without the alive toggle', () => {
    const view = teamHpView({ ...data('full'), allies: { ...data('full').allies, alive: 3 } });

    expect(view.score).toBe('2 : 1');
  });

  it('puts the alive count, not the frags, in the score once toggled', () => {
    const view = teamHpView({ ...data('full'), score_alive: true, allies: { ...data('full').allies, alive: 3 } });

    expect(view.score).toBe('3 : 1');
  });

  it('splits the bar into one segment per tank, sized by its max HP', () => {
    const { enemies } = teamHpView({ ...data('segments'), vehicles: { allies: [], enemies: [vehicle(1800, 1200), vehicle(1500, 0)] } });

    const room = TEAM_HP.barWidth.segments - TEAM_HP.segmentGap;

    expect(enemies.segments).toMatchObject([
      { kind: 'segment', width: Math.round((1800 / 3300) * room) },
      { kind: 'segment', width: Math.round((1500 / 3300) * room), fill: 0, alive: false }
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

    expect(enemies.strip.map((item) => (item.kind === 'tier' ? item.label : item.kind))).toEqual(['X', 'vehicle', 'IX', 'vehicle']);
    expect(allies.strip.map((item) => (item.kind === 'tier' ? item.label : item.kind))).toEqual(['vehicle', 'IX', 'vehicle', 'vehicle', 'X']);
  });

  it('dims the dead in the icon strip', () => {
    const { enemies } = teamHpView({ ...data('icons'), vehicles: { allies: [], enemies: [vehicle(1500, 0)] } });

    expect(enemies.strip[0]).toMatchObject({ alpha: TEAM_HP.deadAlpha, bar: 0 });
  });

  it('keeps compact styles to one line', () => {
    expect(teamHpView(data('compact'))).toMatchObject({ showBars: false, diff: null, compact: true });
    expect(teamHpView(data('minimal'))).toMatchObject({ showNumbers: false, barHeight: TEAM_HP.barHeight.thin });
  });
});
