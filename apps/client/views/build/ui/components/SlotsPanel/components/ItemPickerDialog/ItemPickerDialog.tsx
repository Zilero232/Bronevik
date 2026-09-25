'use client';

import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER } from '@/shared/lib';
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
          {items.length === 0 && <DialogDescription className={s.hint}>{t('slot.noItems')}</DialogDescription>}
        </DialogHeader>
        <motion.ul animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
          {items.map((item) => (
            <PickerItem key={item.id} isSelected={item.id === selectedId} isTaken={takenIds.includes(item.id)} item={item} onPick={onPick} />
          ))}
        </motion.ul>
        {selectedId !== null && (
          <DialogFooter>
            <Button variant='ghost' onClick={() => onPick(null)}>
              <X size={16} />
              {t('slot.clear')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
