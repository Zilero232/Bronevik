'use client';

import { Map as MapIcon, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, IconButton, RelativeTime } from '@/ui-kit';

import type { BoardRowProps } from './BoardRow.types';

import { useBoardRow } from '../../../model/hooks';
import { DeleteBoardDialog } from '../DeleteBoardDialog';

import s from './BoardRow.module.scss';

export const BoardRow = ({ board }: BoardRowProps) => {
  const t = useTranslations('tactics');
  const { mapName, modeName, summary, isConfirming, isDeleting, onConfirmChange, onDelete } = useBoardRow(board);

  return (
    <li className={s.root}>
      <div className={s.main}>
        <Link className={s.title} href={ROUTES.tactics.board(board.id)}>
          {board.title}
        </Link>
        <div className={s.meta}>
          <span className={s.map}>
            <MapIcon size={13} />
            {mapName ?? t('list.noMap')}
          </span>
          {modeName && <span>{modeName}</span>}
          <span className={s.counts}>{t('list.counts', summary)}</span>
        </div>
      </div>
      <Badge tone={board.visibility === 'public' ? 'accent' : 'neutral'}>{t(`visibility.${board.visibility}`)}</Badge>
      <RelativeTime className={s.time} value={board.updatedAt} />
      <IconButton aria-label={t('list.delete')} size='sm' variant='ghost' onClick={() => onConfirmChange(true)}>
        <Trash2 size={15} />
      </IconButton>
      <DeleteBoardDialog isPending={isDeleting} open={isConfirming} title={board.title} onConfirm={onDelete} onOpenChange={onConfirmChange} />
    </li>
  );
};
