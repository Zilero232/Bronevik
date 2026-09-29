import type { OutsideNoticeProps } from './OutsideNotice.types';

import s from './OutsideNotice.module.scss';

export const OutsideNotice = ({ title, description, children }: OutsideNoticeProps) => (
  <section className={s.root}>
    <h1 className={s.title}>{title}</h1>
    <p className={s.description}>{description}</p>
    {children}
  </section>
);
