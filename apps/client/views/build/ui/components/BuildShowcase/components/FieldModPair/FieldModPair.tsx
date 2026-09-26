'use client';

import { useFormatter } from 'next-intl';

import { GameIcon } from '@/entities/tank/build';
import { TierNumeral, Tooltip } from '@/ui-kit';

import type { FieldModPairProps } from './FieldModPair.types';

import s from './FieldModPair.module.scss';

export const FieldModPair = ({ pair, isShares }: FieldModPairProps) => {
  const format = useFormatter();

  const hasPick = pair.options.some(({ isPicked }) => isPicked);

  return (
    <li className={s.root}>
      <TierNumeral className={s.hex} tier={pair.level} variant='hex' />
      <div className={s.tiles}>
        {pair.options.map((option) => (
          <Tooltip key={option.id} content={option.name}>
            <span aria-label={option.name} className={s.tile} data-dimmed={hasPick && !option.isPicked} data-picked={option.isPicked} role='img'>
              <GameIcon kind='fieldModification' size={72} src={option.image} />
              {!option.image && <span className={s.name}>{option.name}</span>}
              {isShares && option.share !== null && <span className={s.share}>{format.number(option.share, 'share')}</span>}
            </span>
          </Tooltip>
        ))}
      </div>
    </li>
  );
};
