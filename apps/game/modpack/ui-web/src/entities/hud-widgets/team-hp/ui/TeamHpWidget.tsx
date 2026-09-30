import clsx from 'clsx';

import type { TeamHpWidgetProps } from './TeamHpWidget.types';

import { HudPlate } from '../../../../shared/ui/hud';
import { teamHpView } from '../lib/team-hp-view';
import { TeamBar, TeamCenter, TeamStrip } from './components';

import s from './TeamHpWidget.module.scss';

export const TeamHpWidget = ({ data }: TeamHpWidgetProps) => {
  const view = teamHpView(data);
  const numbersOutside = view.numbers === 'outside';

  return (
    <HudPlate className={s.plate}>
      <div className={s.row}>
        {numbersOutside && (
          <span className={clsx(s.hp, s.left)} style={{ color: view.colors.ally }}>
            {view.allies.hp}
          </span>
        )}
        {view.showBars && <TeamBar mirrored color={view.colors.ally} height={view.barHeight} side={view.allies} view={view} />}
        <TeamCenter view={view} />
        {view.showBars && <TeamBar color={view.colors.enemy} height={view.barHeight} side={view.enemies} view={view} />}
        {numbersOutside && (
          <span className={clsx(s.hp, s.right)} style={{ color: view.colors.enemy }}>
            {view.enemies.hp}
          </span>
        )}
      </div>
      {view.showStrip && (
        <div className={s.strips}>
          <TeamStrip mirrored color={view.colors.ally} items={view.allies.strip} />
          <TeamCenter blank view={view} />
          <TeamStrip color={view.colors.enemy} items={view.enemies.strip} />
        </div>
      )}
    </HudPlate>
  );
};
