import clsx from 'clsx';

import type { BattleLoadoutWidgetProps } from './BattleLoadoutWidget.types';

import { ClientIcon, Glyph, HudTip } from '../../../../shared/ui/hud';
import { BATTLE_LOADOUT } from '../config';
import { loadoutEntries } from '../lib/loadout-view';
import { useItemTooltip } from '../model/hooks';

import s from './BattleLoadoutWidget.module.scss';

export const BattleLoadoutWidget = ({ data }: BattleLoadoutWidgetProps) => {
  const { tip, handlers } = useItemTooltip(data.items);

  return (
    <div className={s.root}>
      {tip && (
        <HudTip
          className={s.tip}
          mark={tip.bonus && <Glyph name={BATTLE_LOADOUT.bonusGlyph} size={BATTLE_LOADOUT.bonusSize} tone='gold' />}
          text={tip.effect}
          title={tip.name}
        />
      )}
      <div className={s.row}>
        {loadoutEntries(data.items).map((entry) =>
          entry.kind === 'divider' ? (
            <span key={entry.key} className={s.divider} />
          ) : (
            <div
              key={entry.key}
              className={clsx(
                s.cell,
                entry.item.bonus && s.bonus,
                entry.item.boosted && s.boosted,
                entry.item.active && s.active,
                entry.item.used && s.used
              )}
              {...handlers(entry.index)}
            >
              <ClientIcon icon={entry.item.icon} size={data.size} tone='muted' />
              {entry.item.overlay && <ClientIcon className={s.overlay} icon={entry.item.overlay} size={data.size} />}
              {entry.item.bonus && <Glyph className={s.star} name={BATTLE_LOADOUT.bonusGlyph} size={BATTLE_LOADOUT.bonusSize} tone='gold' />}
              {entry.item.attention && (
                <Glyph className={s.attention} name={BATTLE_LOADOUT.attentionGlyph} size={BATTLE_LOADOUT.attentionSize} tone='warning' />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
