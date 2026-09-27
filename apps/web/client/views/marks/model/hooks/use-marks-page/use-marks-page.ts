'use client';

import type { MoeRow } from '@otmetki/schemas';

import { useBoolean } from '@siberiacancode/reactuse';
import { useState } from 'react';

import { useMoeRows } from '../use-moe-rows';

export const useMarksPage = () => {
  const moe = useMoeRows();
  const [selected, setSelected] = useState<MoeRow | null>(null);
  const [isDrawerOpen, toggleDrawer] = useBoolean(false);

  const onSelect = (row: MoeRow) => {
    setSelected(row);
    toggleDrawer(true);
  };

  return { ...moe, selected, isDrawerOpen, onSelect, onDrawerChange: toggleDrawer };
};
