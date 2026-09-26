'use client';

import { useTranslations } from 'next-intl';

import { Button, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/ui-kit';

import type { ItemPickerDialogProps } from './ItemPickerDialog.types';

import { useBuildContext } from '../../../../../model/context';
import { PickerItem } from '../PickerItem';

import s from './ItemPickerDialog.module.scss';

export const ItemPickerDialog = ({ open, title, items, selectedId, takenIds, onPick, onOpenChange }: ItemPickerDialogProps) => {
  const t = useTranslations('builds');
  const { side } = useBuildContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={s.content} data-side={side}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {items.length === 0 && <DialogDescription>{t('slot.noItems')}</DialogDescription>}
        </DialogHeader>
        <ul className={s.grid}>
          {items.map((item) => (
            <PickerItem key={item.id} isSelected={item.id === selectedId} isTaken={takenIds.includes(item.id)} item={item} onPick={onPick} />
          ))}
        </ul>
        {selectedId !== null && (
          <DialogFooter>
            <Button size='sm' variant='ghost' onClick={() => onPick(null)}>
              {t('slot.clear')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
