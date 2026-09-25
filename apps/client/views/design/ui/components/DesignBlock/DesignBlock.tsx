import { clsx } from 'clsx';

import { Card, CardHeader } from '@/ui-kit';

import type { DesignBlockProps, DesignRowProps } from './DesignBlock.types';

import s from './DesignBlock.module.scss';

export const DesignBlock = ({ id, eyebrow, title, action, className, children }: DesignBlockProps) => (
  <section className={s.root} id={id}>
    <Card className={s.card} padding='lg'>
      <CardHeader action={action} eyebrow={eyebrow} title={title} />
      <div className={clsx(s.body, className)}>{children}</div>
    </Card>
  </section>
);

export const DesignRow = ({ label, className, children }: DesignRowProps) => (
  <div className={s.row}>
    <span className={s.label}>{label}</span>
    <div className={clsx(s.items, className)}>{children}</div>
  </div>
);
