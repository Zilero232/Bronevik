'use client';

import { useTranslations } from 'next-intl';

import { useOperationColumns } from '../../../model/hooks';
import { BranchColumn } from './components';

import s from './BranchBoard.module.scss';

export const BranchBoard = () => {
  const t = useTranslations('missions.board');
  const { columns } = useOperationColumns();

  return (
    <section aria-label={t('label')} className={s.root}>
      <div className={s.scroller}>
        {columns.map((column) => (
          <BranchColumn key={column.branch.chainId} column={column} />
        ))}
      </div>
    </section>
  );
};
