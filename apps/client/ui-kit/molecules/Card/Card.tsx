import type { ComponentProps } from 'react';

import { clsx } from 'clsx';

import type { CardHeaderProps, CardProps } from './Card.types';

import s from './Card.module.scss';

export const Card = ({ variant = 'plate', padding = 'md', isInteractive = false, className, children, ...props }: CardProps) => (
  <div className={clsx(s.root, s[variant], s[`pad-${padding}`], isInteractive && s.interactive, className)} {...props}>
    {children}
  </div>
);

export const CardHeader = ({ eyebrow, title, action, className, children, ...props }: CardHeaderProps) => (
  <div className={clsx(s.header, className)} {...props}>
    <div>
      {eyebrow && <div className={s.eyebrow}>{eyebrow}</div>}
      {title && <h3 className={s.title}>{title}</h3>}
      {children}
    </div>
    {action}
  </div>
);

export const CardBody = ({ className, ...props }: ComponentProps<'div'>) => <div className={clsx(s.body, className)} {...props} />;
