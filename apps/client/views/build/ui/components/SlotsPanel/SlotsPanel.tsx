'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { SlotsPanelProps } from './SlotsPanel.types';

import { PANEL_ICONS } from '../../../config';
import { setSlotItem, slotsOf, takenIds } from '../../../lib/loadout-edit';
import { useBuildContext } from '../../../model/context';
import { PanelCard } from '../PanelCard';
import { ItemPickerDialog, ItemSlot } from './components';

import s from './SlotsPanel.module.scss';

export const SlotsPanel = ({ field, index }: SlotsPanelProps) => {
  const t = useTranslations('builds.panels');
  const { catalog, active, edit } = useBuildContext();
  const [picker, setPicker] = useState({ slot: 0, isOpen: false });

  const items = catalog[field];
  const slots = slotsOf({ loadout: active, field });
  const cells = slots.map((id, slot) => ({ key: `${field}-${slot}`, slot, item: items.find((item) => item.id === id) ?? null }));

  const place = (slot: number) => (id: number | null) => edit((loadout) => setSlotItem({ loadout, field, slot, id }));

  const onPick = (id: number | null) => {
    place(picker.slot)(id);
    setPicker({ slot: picker.slot, isOpen: false });
  };

  const onOpenChange = (isOpen: boolean) => setPicker({ slot: picker.slot, isOpen });

  return (
    <PanelCard description={t(`${field}.description`)} icon={PANEL_ICONS[field]} index={index} title={t(`${field}.title`)}>
      <div className={s.slots} data-field={field}>
        {cells.map(({ key, slot, item }) => (
          <ItemSlot key={key} index={slot} item={item} onClear={() => place(slot)(null)} onOpen={() => setPicker({ slot, isOpen: true })} />
        ))}
      </div>
      <ItemPickerDialog
        items={items}
        open={picker.isOpen}
        selectedId={slots[picker.slot] ?? null}
        takenIds={takenIds({ loadout: active, field, slot: picker.slot })}
        title={t(`${field}.pick`)}
        onOpenChange={onOpenChange}
        onPick={onPick}
      />
    </PanelCard>
  );
};
