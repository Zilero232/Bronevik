import type { BaseCardProps } from './BaseCard.types';

import s from './BaseCard.module.scss';

export const BaseCard = ({ title, figures, children }: BaseCardProps) => (
  <article className={s.root}>
    <h3 className={s.title}>{title}</h3>
    {figures}
    <div className={s.sections}>{children}</div>
  </article>
);
