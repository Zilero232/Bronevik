import type { TierBandProps } from './TierBand.types';

import { TierCard } from '../TierCard';

import s from './TierBand.module.scss';

export const TierBand = ({ group }: TierBandProps) => (
  <div className={s.root} data-rank={group.rank}>
    <div aria-hidden className={s.rank}>
      {group.rank}
    </div>
    <ul className={s.cards}>
      {group.entries.map((entry) => (
        <TierCard key={entry.vehicle.tankId} entry={entry} />
      ))}
    </ul>
  </div>
);
