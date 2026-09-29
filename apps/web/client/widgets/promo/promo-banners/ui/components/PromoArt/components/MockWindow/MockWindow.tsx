import { OtmetkiLogoIcon } from '@otmetki/icons';
import { clsx } from 'clsx';

import type { MockWindowProps } from './MockWindow.types';

import { PROMO_ICON } from '../../../../../config';

import s from './MockWindow.module.scss';

export const MockWindow = ({ title, children, className }: MockWindowProps) => (
  <div className={clsx(s.root, className)}>
    <div className={s.bar}>
      <OtmetkiLogoIcon className={s.logo} size={PROMO_ICON.mock} />
      <span className={s.title}>{title}</span>
      <span className={s.lights}>
        <span />
        <span />
        <span />
      </span>
    </div>
    <div className={s.body}>{children}</div>
  </div>
);
