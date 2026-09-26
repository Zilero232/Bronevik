'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, ErrorState } from '@/ui-kit';

import { openExternally } from '../../../lib/open-externally';
import { useMiniDashboard } from '../../../model/hooks';
import { MiniSkeleton } from '../MiniSkeleton';
import { PlayerDashboard } from '../PlayerDashboard';

export const MiniDashboard = () => {
  const t = useTranslations('tg.noAccount');
  const { account, isPending, isFailed, isRetrying, retry } = useMiniDashboard();

  return match({ isPending, isFailed, account })
    .with({ isPending: true }, () => <MiniSkeleton />)
    .with({ isFailed: true }, () => <ErrorState isRetrying={isRetrying} onRetry={retry} />)
    .with({ account: null }, () => (
      <EmptyState
        action={
          <Link className={buttonVariants()} href={ROUTES.me} onClick={openExternally}>
            {t('action')}
          </Link>
        }
        description={t('description')}
        title={t('title')}
      />
    ))
    .with({ account: P.nonNullable }, ({ account: linked }) => <PlayerDashboard accountId={linked.accountId} nickname={linked.nickname} />)
    .exhaustive();
};
