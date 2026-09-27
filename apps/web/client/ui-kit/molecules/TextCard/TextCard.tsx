import type { TextCardProps } from './TextCard.types';

import { Card, CardBody, CardHeader } from '../Card';

import s from './TextCard.module.scss';

export const TextCard = ({ title, children, className }: TextCardProps) => (
  <Card className={className} padding='none'>
    <CardHeader title={title} />
    <CardBody>
      <p className={s.text}>{children}</p>
    </CardBody>
  </Card>
);
