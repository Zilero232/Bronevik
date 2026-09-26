'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, EmptyState, ErrorState, KeyFigure, KeyFigures, RelativeTime, Skeleton } from '@/ui-kit';

import { PROGRESS_PAGE } from '../../../config';
import { useShells } from '../../../model/hooks';

import s from './ShellsCard.module.scss';

export const ShellsCard = () => {
  const t = useTranslations('progression.shells');
  const tPage = useTranslations('progression');
  const format = useFormatter();
  const { shells, entries, isPending, isError, isRetrying, retry } = useShells();

  if (isPending) {
    return <Skeleton height={PROGRESS_PAGE.skeletonHeight} shape='block' />;
  }

  if (isError || !shells) {
    return <ErrorState isCompact isRetrying={isRetrying} onRetry={retry} />;
  }

  return (
    <Card className={s.root} padding='lg'>
      <CardHeader action={<Link href={ROUTES.account.cosmetics}>{tPage('cosmeticsLink')}</Link>} title={t('title')} />
      <KeyFigure hint={t('hint')} label={t('title')} size='xl' value={shells.balance} />
      <KeyFigures>
        <KeyFigure label={t('earned')} value={shells.earned} />
        <KeyFigure label={t('spent')} value={shells.spent} />
      </KeyFigures>
      {entries.length === 0 ? (
        <EmptyState isCompact title={t('empty')} />
      ) : (
        <ul className={s.list}>
          {entries.map((entry) => (
            <li key={entry.id} className={s.entry}>
              <span className={s.reason}>{t(`reason.${entry.reason}`)}</span>
              <RelativeTime className={s.time} value={entry.createdAt} />
              <span className={s.amount} data-sign={entry.amount < 0 ? 'minus' : 'plus'}>
                {format.number(entry.amount, { signDisplay: 'always' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};
