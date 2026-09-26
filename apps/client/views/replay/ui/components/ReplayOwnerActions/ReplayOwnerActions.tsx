'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ReplayVisibility } from '@/shared/api/replays';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  SegmentedControl
} from '@/ui-kit';

import type { ReplayOwnerActionsProps } from './ReplayOwnerActions.types';

import { REPLAY_VISIBILITY_OPTIONS } from '../../../config';
import { useReplayOwnerActions } from '../../../model/hooks';

import s from './ReplayOwnerActions.module.scss';

export const ReplayOwnerActions = ({ replay }: ReplayOwnerActionsProps) => {
  const t = useTranslations('replays.owner');
  const { canManage, visibility, isDeleting, onVisibilityChange, onDelete } = useReplayOwnerActions(replay);
  const [isOpen, toggleOpen] = useBoolean(false);

  if (!canManage) {
    return null;
  }

  return (
    <div className={s.root}>
      <span className={s.label}>{t('title')}</span>
      <SegmentedControl<ReplayVisibility>
        aria-label={t('visibility')}
        options={REPLAY_VISIBILITY_OPTIONS.map((value) => ({ value, label: t(`visibilities.${value}`) }))}
        size='sm'
        value={visibility}
        onChange={onVisibilityChange}
      />
      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        <DialogTrigger
          render={
            <Button className={s.delete} size='sm' variant='ghost'>
              <Trash2 size={14} />
              {t('delete')}
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deleteTitle')}</DialogTitle>
            <DialogDescription>{t('deleteDescription')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant='ghost'>{t('cancel')}</Button>} />
            <Button disabled={isDeleting} variant='danger' onClick={onDelete}>
              {t('confirmDelete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
