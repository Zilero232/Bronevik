'use client';

import { useState } from 'react';

import type { UseSlotsPanelInput } from './use-slots-panel.types';

import { setSlotItem, slotsOf, takenIds } from '../../../lib/loadout-edit';
import { useBuildContext } from '../../context';

export const useSlotsPanel = ({ field }: UseSlotsPanelInput) => {
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

  const onOpen = (slot: number) => () => setPicker({ slot, isOpen: true });
  const onClear = (slot: number) => () => place(slot)(null);
  const onOpenChange = (isOpen: boolean) => setPicker({ slot: picker.slot, isOpen });

  return {
    items,
    cells,
    isPickerOpen: picker.isOpen,
    selectedId: slots[picker.slot] ?? null,
    takenIds: takenIds({ loadout: active, field, slot: picker.slot }),
    onPick,
    onOpen,
    onClear,
    onOpenChange
  };
};
