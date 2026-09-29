import { Check, Flame, Hourglass, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { PuzzleStatusProps } from './PuzzleStatus.types';

import s from './PuzzleStatus.module.scss';

export const PuzzleStatus = ({ status, clock }: PuzzleStatusProps) => {
  const t = useTranslations('play.hub.status');

  if (!status || clock === null) {
    return <span aria-hidden data-pending className={s.root} />;
  }

  return (
    <span className={s.root}>
      <span className={s.state} data-kind={status.kind}>
        {status.kind === 'solved' && <Check aria-hidden size={14} strokeWidth={2.5} />}
        {status.kind === 'failed' && <X aria-hidden size={14} strokeWidth={2.5} />}
        {t(status.kind, { attempts: status.attempts })}
      </span>
      <span className={s.item}>
        <Flame aria-hidden className={s.flame} data-lit={status.streak > 0} size={14} />
        {t('streak', { count: status.streak })}
      </span>
      <span className={s.item}>
        <Hourglass aria-hidden size={14} />
        {t('next')}
        <time suppressHydrationWarning className={s.clock}>
          {clock}
        </time>
      </span>
    </span>
  );
};
