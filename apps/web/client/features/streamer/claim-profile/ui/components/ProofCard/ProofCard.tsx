import { Card, CardHeader } from '@/ui-kit';

import type { ProofCardProps } from './ProofCard.types';

import s from './ProofCard.module.scss';

export const ProofCard = ({ title, description, children }: ProofCardProps) => (
  <Card className={s.root} padding='md'>
    <CardHeader title={title} />
    <p className={s.description}>{description}</p>
    {children}
  </Card>
);
