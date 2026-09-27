'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import type { TacticBoardPageProps } from './TacticBoardPage.types';

import { useTacticBoardPage } from '../model/hooks';
import { BoardHeader, BoardWorkspace, SharePanel } from './components';

import s from './TacticBoardPage.module.scss';

export const TacticBoardPage = ({ id }: TacticBoardPageProps) => {
  const t = useTranslations('tactics.board');
  const tCommon = useTranslations('common');
  const { query, token } = useTacticBoardPage(id);

  return (
    <div className={s.root}>
      <ResourceGate
        back={{ href: ROUTES.tactics.list, label: t('backToList') }}
        error={{ title: tCommon('loadErrorTitle'), description: tCommon('loadErrorDescription') }}
        notFound={{ title: t('notFound'), description: t('notFoundHint') }}
        query={query}
        skeleton={<Skeleton height={560} shape='block' />}
      >
        {(board) => (
          <>
            <BoardHeader board={board} token={token} />
            {board.role === 'owner' && <SharePanel board={board} token={token} />}
            <BoardWorkspace key={board.id} board={board} urlToken={token} />
          </>
        )}
      </ResourceGate>
    </div>
  );
};
