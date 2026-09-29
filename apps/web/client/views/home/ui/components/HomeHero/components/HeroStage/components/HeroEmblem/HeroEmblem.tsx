import { Mark3Icon } from '@otmetki/icons';

import { HOME_ICON } from '../../../../../../../config';

import s from './HeroEmblem.module.scss';

export const HeroEmblem = () => (
  <div aria-hidden className={s.root}>
    <span className={s.rings} />
    <span className={s.sweep} />
    <span className={s.plate}>
      <Mark3Icon className={s.mark} size={HOME_ICON.heroMark} strokeWidth={HOME_ICON.heroMarkStroke} />
    </span>
  </div>
);
