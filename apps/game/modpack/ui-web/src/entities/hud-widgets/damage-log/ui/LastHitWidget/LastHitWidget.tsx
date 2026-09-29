import type { LastHitWidgetProps } from './LastHitWidget.types';

import { ClientIcon, HudPlate } from '../../../../../shared/ui/hud';
import { DAMAGE_LOG } from '../../config';
import { useLastHit } from '../../model/hooks';

import s from './LastHitWidget.module.scss';

export const LastHitWidget = ({ data }: LastHitWidgetProps) => {
  const { flash, amount } = useLastHit(data);

  return (
    <HudPlate className={s.card} flash={flash} rail='received'>
      <div className={s.row}>
        <ClientIcon className={s.icon} icon={data.cls} size={DAMAGE_LOG.lastHit.classSize} />
        <span className={s.name}>{data.name}</span>
        <span className={s.amount}>{amount}</span>
        <ClientIcon className={s.icon} icon={data.shell} size={DAMAGE_LOG.lastHit.shellSize} />
        <ClientIcon className={s.icon} icon={data.source} size={DAMAGE_LOG.lastHit.shellSize} />
        <ClientIcon className={s.icon} icon={data.ammo_rack} size={DAMAGE_LOG.lastHit.shellSize} />
      </div>
    </HudPlate>
  );
};
