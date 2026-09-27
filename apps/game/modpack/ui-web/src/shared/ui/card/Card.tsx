import type { CardProps } from './Card.types';

import s from './Card.module.scss';

export const Card = ({ title, hint, aside, children }: CardProps) => (
  <article className={s.card}>
    <header className={s.head}>
      <div className={s.titles}>
        <h2 className={s.title}>{title}</h2>
        {hint && <p className={s.hint}>{hint}</p>}
      </div>
      {aside}
    </header>
    {children}
  </article>
);
