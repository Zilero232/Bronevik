import { describe, expect, it } from 'vitest';

import type { TeamHpData } from '../../../model/schemas';

import { teamHpView } from '../team-hp-view';

const data = (style: TeamHpData['style']): TeamHpData => ({
  style,
  allies: { hp: 3200, max: 5300, alive: 2, count: 3, frags: 2 },
  enemies: { hp: 900, max: 5200, alive: 1, count: 3, frags: 1 },
  show_score: true,
  diff: 2300,
  colors: { ally: '#7CD35B', enemy: '#E3564A' },
  vehicles: {
    allies: [
      { icon: null, hp: 1200, max: 1800, alive: true },
      { icon: null, hp: 0, max: 1500, alive: false }
    ],
    enemies: [{ icon: null, hp: 900, max: 1700, alive: true }]
  }
});

describe(teamHpView, () => {
  it('fills the bar pair by the share of HP left and signs the difference', () => {
    const view = teamHpView(data('full'));

    expect(view).toMatchObject({ showNumbers: true, showBars: true, showStrip: false, score: '2 : 1', diff: '+2 300', diffAhead: true });
    expect(view.allies.fill).toBe(Math.round((3200 / 5300) * 190));
    expect(view.allies.hp).toBe('3 200');
  });

  it('splits the bar into one segment per tank, sized by its max HP', () => {
    const { allies } = teamHpView(data('segments'));

    expect(allies.segments.map(({ width }) => width)).toEqual([119, 100]);
    expect(allies.segments[1]).toMatchObject({ fill: 0, alive: false });
  });

  it('dims the dead in the icon strip and keeps compact styles to one line', () => {
    expect(teamHpView(data('icons')).allies.vehicles[1]).toMatchObject({ alpha: 0.35, bar: 0 });
    expect(teamHpView(data('compact'))).toMatchObject({ showBars: false, diff: null, compact: true });
    expect(teamHpView(data('minimal'))).toMatchObject({ showNumbers: false, barHeight: 4 });
  });
});
