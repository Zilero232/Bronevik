'use client';

import { useTranslations } from 'next-intl';

import type { SlotsPanelProps } from './SlotsPanel.types';

import { useSlotsPanel } from '../../../model/hooks';
import { PanelCard } from '../PanelCard';
import { ItemPickerDialog, ItemSlot } from './components';

import s from './SlotsPanel.module.scss';

export const SlotsPanel = ({ field }: SlotsPanelProps) => {
  const t = useTranslations('builds.panels');
  const { items, cells, isPickerOpen, selectedId, takenIds, onPick, onOpen, onClear, onOpenChange } = useSlotsPanel({ field });

  return (
    <PanelCard description={t(`${field}.description`)} title={t(`${field}.title`)}>
      <div className={s.slots} data-field={field}>
        {cells.map(({ key, slot, item }) => (
          <ItemSlot key={key} index={slot} item={item} onClear={onClear(slot)} onOpen={onOpen(slot)} />
        ))}
      </div>
      <ItemPickerDialog
        items={items}
        open={isPickerOpen}
        selectedId={selectedId}
        takenIds={takenIds}
        title={t(`${field}.pick`)}
        onOpenChange={onOpenChange}
        onPick={onPick}
      />
    </PanelCard>
  );
};
