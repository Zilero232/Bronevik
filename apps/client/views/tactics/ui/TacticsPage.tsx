'use client';

import { LayoutDashboard, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { useLoginHref } from '@/entities/auth/session';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import { useTacticsPage } from '../model/hooks';
import { BoardList, CreateBoardDialog } from './components';

import s from './TacticsPage.module.scss';

export const TacticsPage = () => {
  const loginHref = useLoginHref();
  const t = useTranslations('tactics.list');
  const { isSessionPending, isSignedIn, boards, isPending, isError, isFetching, onRetry } = useTacticsPage();

  return (
    <div className={s.root}>
      <PageHeader actions={isSignedIn && <CreateBoardDialog />} description={t('description')} title={t('title')} />
      {match({ isSessionPending, isSignedIn, isPending, isError, count: boards.length })
        .with(P.union({ isSessionPending: true }, { isPending: true }), () => <Skeleton height={220} shape='block' />)
        .with({ isSignedIn: false }, () => (
          <EmptyState
            action={
              <Link className={buttonVariants({ size: 'sm' })} href={loginHref}>
                <LogIn size={15} />
                {t('signIn')}
              </Link>
            }
            description={t('signInHint')}
            icon={<LogIn size={22} />}
            title={t('signInTitle')}
          />
        ))
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} onRetry={onRetry} />)
        .with({ count: 0 }, () => <EmptyState description={t('emptyHint')} icon={<LayoutDashboard size={22} />} title={t('empty')} />)
        .otherwise(() => (
          <BoardList boards={boards} />
        ))}
    </div>
  );
};
