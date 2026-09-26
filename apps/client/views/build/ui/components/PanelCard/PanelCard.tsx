import { clsx } from 'clsx';

import { Card, CardHeader } from '@/ui-kit';

import type { PanelCardProps } from './PanelCard.types';

import s from './PanelCard.module.scss';

export const PanelCard = ({ title, description, action, children, className }: PanelCardProps) => (
  <Card aria-label={title} className={clsx(s.root, className)} padding='none' role='region'>
    <CardHeader action={action} className={s.header} title={title} />
    <div className={s.body}>
      {description && <p className={s.description}>{description}</p>}
      {children}
    </div>
  </Card>
);
