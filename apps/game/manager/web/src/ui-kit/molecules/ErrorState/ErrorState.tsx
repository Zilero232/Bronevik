import { TriangleAlert } from 'lucide-react';

import type { ErrorStateProps } from './ErrorState.types';

import { Button } from '../../atoms';

import s from './ErrorState.module.scss';

export const ErrorState = ({ title, message, retryLabel, onRetry }: ErrorStateProps) => (
  <div className={s.root} role='alert'>
    <TriangleAlert aria-hidden className={s.icon} />
    <div className={s.text}>
      <p className={s.title}>{title}</p>
      {message && <p className={s.message}>{message}</p>}
    </div>
    <Button size='sm' variant='secondary' onClick={onRetry}>
      {retryLabel}
    </Button>
  </div>
);
