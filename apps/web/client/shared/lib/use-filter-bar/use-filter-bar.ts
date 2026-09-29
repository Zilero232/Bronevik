'use client';

import { useState } from 'react';

export const useFilterBar = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  return {
    isSheetOpen,
    isMoreOpen,
    onSheetOpenChange: setIsSheetOpen,
    onSheetOpen: () => setIsSheetOpen(true),
    onSheetClose: () => setIsSheetOpen(false),
    onMoreToggle: () => setIsMoreOpen((open) => !open)
  };
};
