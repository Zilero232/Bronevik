'use client';

import { Bot } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import { useBotsCard } from '../../../model/hooks';
import { MeCard } from '../MeCard';
import { SectionError } from '../SectionError';
import { BotRow } from './components';

import s from './BotsCard.module.scss';

export const BotsCard = () => {
  const t = useTranslations('me.bots');
  const { rows, isPending, isError, isRetrying, isBusy, onRetry, onLink, onUnlink } = useBotsCard();

  return (
    <MeCard description={t('description')} icon={<Bot size={18} />} title={t('title')}>
      {isPending && <Skeleton height={160} shape='block' />}
      {isError && <SectionError isRetrying={isRetrying} onRetry={onRetry} />}
      {rows.length > 0 && (
        <ul className={s.list}>
          {rows.map((row) => (
            <BotRow key={row.provider} isBusy={isBusy} row={row} onLink={onLink} onUnlink={onUnlink} />
          ))}
        </ul>
      )}
    </MeCard>
  );
};
