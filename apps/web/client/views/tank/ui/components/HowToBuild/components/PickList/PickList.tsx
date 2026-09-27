'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { GameIcon, gameLabel } from '@/entities/tank/build';
import { percentText } from '@/shared/lib';
import { ProgressBar } from '@/ui-kit';

import type { PickListProps } from './PickList.types';

import { HOW_TO_BUILD } from '../../../../../config';

import s from './PickList.module.scss';

export const PickList = ({ picks, title }: PickListProps) => {
  const t = useTranslations('tank.builds');
  const format = useFormatter();

  return (
    <div className={s.root}>
      {title && <h4 className={s.title}>{title}</h4>}
      <ol className={s.list}>
        {picks.map(({ option, share, winRate }) => (
          <li key={option.id} className={s.row}>
            <GameIcon kind={option.kind} size={HOW_TO_BUILD.iconSize} src={option.image} />
            <ProgressBar
              valueLabel={
                <span className={s.value}>
                  {percentText({ format, value: share * 100, digits: 0 })}
                  {winRate !== null && <span className={s.win}>{t('winRate', { value: percentText({ format, value: winRate, digits: 1 }) })}</span>}
                </span>
              }
              className={s.bar}
              label={gameLabel(option.name)}
              size='sm'
              value={share * 100}
            />
          </li>
        ))}
      </ol>
    </div>
  );
};
