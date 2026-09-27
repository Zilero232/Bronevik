import type { ButtonProps } from '../button';
import type { CardActionsProps, CardProps } from './Card.types';

import { Button } from '../button';

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

export const CardActions = ({ children }: CardActionsProps) => <div className={s.actions}>{children}</div>;

export const CardAction = (props: ButtonProps) => <Button className={s.action} {...props} />;
