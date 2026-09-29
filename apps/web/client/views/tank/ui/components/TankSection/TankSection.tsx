import { Card, CardHeader } from '@/ui-kit';

import type { TankSectionProps } from './TankSection.types';

import s from './TankSection.module.scss';

export const TankSection = ({ id, title, meta, action, children }: TankSectionProps) => (
  <Card className={s.root} id={id} padding='none'>
    <CardHeader action={action} className={s.header} meta={meta} title={title} />
    {children}
  </Card>
);
