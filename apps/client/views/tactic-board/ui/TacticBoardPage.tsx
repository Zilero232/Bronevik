'use client';

import { SearchX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { TacticBoardPageProps } from './TacticBoardPage.types';

import { useTacticBoardPage } from '../model/hooks';
import { BoardHeader, BoardWorkspace, SharePanel } from './components';

import s from './TacticBoardPage.module.scss';

export const TacticBoardPage = ({ id }: TacticBoardPageProps) => {
  const t = useTranslations('tactics.board');
  const { board, token, isPending, isNotFound, isError, isFetching, onRetry } = useTacticBoardPage(id);

  return (
    <div className={s.root}>
      {match({ board, isPending, isNotFound, isError })
        .with({ isPending: true }, () => <Skeleton height={560} shape='block' />)
        .with({ isNotFound: true }, () => (
          <EmptyState
            action={
              <Link className={buttonVariants({ size: 'sm', variant: 'secondary' })} href={ROUTES.tactics}>
                {t('backToList')}
              </Link>
            }
            description={t('notFoundHint')}
            icon={<SearchX size={22} />}
            title={t('notFound')}
          />
        ))
        .with({ board: P.nonNullable }, ({ board: current }) => (
          <>
            <BoardHeader board={current} token={token} />
            {current.role === 'owner' && <SharePanel board={current} token={token} />}
            <BoardWorkspace key={current.id} board={current} urlToken={token} />
          </>
        ))
        .otherwise(() => (
          <ErrorState isRetrying={isFetching} onRetry={onRetry} />
        ))}
    </div>
  );
};
