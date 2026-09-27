import { clsx } from 'clsx';
import { useId } from 'react';

import type { CardProps } from './Card.types';

import s from './Card.module.scss';

export const Card = ({ title, description, actions, tone = 'default', children, className }: CardProps) => {
  const titleId = useId();

  return (
    <section aria-labelledby={title ? titleId : undefined} className={clsx(s.root, className)} data-tone={tone}>
      {(title || actions) && (
        <header className={s.header}>
          <div className={s.heading}>
            {title && (
              <h2 className={s.title} id={titleId}>
                {title}
              </h2>
            )}
            {description && <p className={s.description}>{description}</p>}
          </div>
          {actions && <div className={s.actions}>{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
};
