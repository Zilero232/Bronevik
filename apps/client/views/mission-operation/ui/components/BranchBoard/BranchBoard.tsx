import { useTranslations } from 'next-intl';

import type { BranchBoardProps } from './BranchBoard.types';

import { BranchColumn } from './components';

import s from './BranchBoard.module.scss';

export const BranchBoard = ({ columns, selectedId, isTracked, onSelect }: BranchBoardProps) => {
  const t = useTranslations('missions.board');

  return (
    <section aria-label={t('label')} className={s.root}>
      <div className={s.scroller}>
        {columns.map((column) => (
          <BranchColumn key={column.branch.chainId} column={column} isTracked={isTracked} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </div>
    </section>
  );
};
