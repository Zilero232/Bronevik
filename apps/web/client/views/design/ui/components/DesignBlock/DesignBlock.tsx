import { clsx } from 'clsx';

import { Card, CardHeader } from '@/ui-kit';

import type { DesignBlockProps } from './DesignBlock.types';

import s from './DesignBlock.module.scss';

export const DesignBlock = ({ id, title, action, className, children }: DesignBlockProps) => (
  <section className={s.root} id={id}>
    <Card className={s.card} padding='lg'>
      <CardHeader action={action} title={title} />
      <div className={clsx(s.body, className)}>{children}</div>
    </Card>
  </section>
);
