import type { EquipmentTipProps } from './EquipmentTip.types';

import s from './EquipmentTip.module.scss';

export const EquipmentTip = ({ item }: EquipmentTipProps) => (
  <div className={s.tip}>
    <span className={s.name}>{item.name}</span>
    {item.effect && <span className={s.effect}>{item.effect}</span>}
  </div>
);
