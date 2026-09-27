import { clsx } from 'clsx';

import { Card, CardHeader } from '@/ui-kit';

import type { ProfilePanelProps } from './ProfilePanel.types';

import s from './ProfilePanel.module.scss';

export const ProfilePanel = ({ title, meta, action, isFlush = false, className, children }: ProfilePanelProps) => (
  <Card className={clsx(s.root, className)} padding={isFlush ? 'none' : 'md'} variant='well'>
    <CardHeader action={action} meta={meta} title={title} />
    <div className={s.body}>{children}</div>
  </Card>
);
