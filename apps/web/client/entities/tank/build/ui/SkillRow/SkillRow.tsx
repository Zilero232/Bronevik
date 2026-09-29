'use client';

import { clsx } from 'clsx';
import { useFormatter } from 'next-intl';

import type { SkillRowProps } from './SkillRow.types';

import { SKILL_ROW } from '../../config';
import { GameIcon } from '../GameIcon';

import s from './SkillRow.module.scss';

export const SkillRow = ({ index, name, image, share = null, className }: SkillRowProps) => {
  const format = useFormatter();

  return (
    <li className={clsx(s.root, className)}>
      <span className={s.index}>{index}.</span>
      <GameIcon kind='skill' size={SKILL_ROW.iconSize} src={image} />
      <span className={s.name}>{name}</span>
      {share !== null && (
        <span className={s.share}>
          <span className={s.shareValue}>{format.number(share, 'share')}</span>
          <span aria-hidden className={s.track}>
            <span className={s.fill} style={{ scale: `${share} 1` }} />
          </span>
        </span>
      )}
    </li>
  );
};
