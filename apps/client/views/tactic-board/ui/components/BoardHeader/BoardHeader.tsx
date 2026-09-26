'use client';

import { Map as MapIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { TacticBoardVisibility } from '@/shared/api/tactics';

import { ROUTES } from '@/shared/constants';
import { Badge, PageHeader, Select } from '@/ui-kit';

import type { BoardHeaderProps } from './BoardHeader.types';

import { useBoardHeader } from '../../../model/hooks';
import { BoardSettingsDialog } from '../BoardSettingsDialog';

import s from './BoardHeader.module.scss';

export const BoardHeader = ({ board, token }: BoardHeaderProps) => {
  const t = useTranslations('tactics');
  const { isOwner, mapName, camouflage, modeName, visibilityItems, onVisibilityChange } = useBoardHeader({ board, token });

  return (
    <PageHeader
      actions={
        isOwner && (
          <div className={s.actions}>
            <Select<TacticBoardVisibility>
              className={s.visibility}
              items={visibilityItems}
              value={board.visibility}
              onValueChange={onVisibilityChange}
            />
            <BoardSettingsDialog board={board} token={token} />
          </div>
        )
      }
      meta={
        <div className={s.meta}>
          <Badge tone={board.role === 'view' ? 'neutral' : 'accent'}>{t(`roles.${board.role}`)}</Badge>
          <span className={s.item}>
            <MapIcon size={14} />
            {mapName ?? t('list.noMap')}
          </span>
          {camouflage && <span className={s.item}>{camouflage}</span>}
          {modeName && <span className={s.item}>{modeName}</span>}
          {!isOwner && <span className={s.item}>{t(`visibility.${board.visibility}`)}</span>}
        </div>
      }
      breadcrumbs={[{ label: t('list.title'), href: ROUTES.tactics }, { label: board.title }]}
      title={board.title}
    />
  );
};
