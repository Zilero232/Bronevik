import { clsx } from 'clsx';

import { Card, CardHeader } from '@/ui-kit';

import type { TabCardProps } from './TabCard.types';

import s from './TabCard.module.scss';

export const TabCard = ({ eyebrow, title, action, className, children }: TabCardProps) => (
  <Card className={clsx(s.root, className)} padding='lg'>
    <CardHeader action={action} eyebrow={eyebrow} title={title} />
    <div className={s.body}>{children}</div>
  </Card>
);
