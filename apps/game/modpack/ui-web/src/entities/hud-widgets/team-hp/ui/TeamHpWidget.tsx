import clsx from 'clsx';

import type { TeamHpWidgetProps } from './TeamHpWidget.types';

import { HudPlate } from '../../../../shared/ui/hud';
import { teamHpView } from '../lib/team-hp-view';
import { TeamBar, TeamStrip } from './components';

import s from './TeamHpWidget.module.scss';

export const TeamHpWidget = ({ data }: TeamHpWidgetProps) => {
  const view = teamHpView(data);

  return (
    <HudPlate className={clsx(s.plate, view.compact && s.compact)}>
      <div className={s.row}>
        {view.showNumbers && (
          <span className={clsx(s.hp, s.left)} style={{ color: view.colors.ally }}>
            {view.allies.hp}
          </span>
        )}
        {view.showBars && <TeamBar mirrored color={view.colors.ally} height={view.barHeight} side={view.allies} view={view} />}
        {view.score !== null && <span className={s.score}>{view.score}</span>}
        {view.showBars && <TeamBar color={view.colors.enemy} height={view.barHeight} side={view.enemies} view={view} />}
        {view.showNumbers && (
          <span className={clsx(s.hp, s.right)} style={{ color: view.colors.enemy }}>
            {view.enemies.hp}
          </span>
        )}
      </div>
      {view.showStrip && (
        <div className={s.row}>
          <TeamStrip mirrored color={view.colors.ally} vehicles={view.allies.vehicles} />
          <span className={s.gap} />
          <TeamStrip color={view.colors.enemy} vehicles={view.enemies.vehicles} />
        </div>
      )}
      {view.diff !== null && <span className={clsx(s.diff, view.diffAhead ? s.ahead : s.behind)}>{`Δ ${view.diff}`}</span>}
    </HudPlate>
  );
};
