import Image from 'next/image';

import type { MedalCellProps } from './MedalCell.types';

import { ACHIEVEMENTS } from '../../../../../config';

import s from './MedalCell.module.scss';

export const MedalCell = ({ medal: { title, description, image } }: MedalCellProps) => (
  <span className={s.root}>
    {image ? (
      <Image unoptimized alt='' className={s.image} height={ACHIEVEMENTS.medalSize} src={image} width={ACHIEVEMENTS.medalSize} />
    ) : (
      <span aria-hidden className={s.image} />
    )}
    <span className={s.text}>
      <span className={s.title}>{title}</span>
      {description && <span className={s.description}>{description}</span>}
    </span>
  </span>
);
