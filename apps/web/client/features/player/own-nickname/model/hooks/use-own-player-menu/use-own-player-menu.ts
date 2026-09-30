'use client';

import { useState } from 'react';

import { forgetOwnPlayer, useOwnPlayer } from '@/entities/player/own-player';

export const useOwnPlayerMenu = () => {
  const { isReady, player } = useOwnPlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const close = () => {
    setIsOpen(false);
    setIsSwitching(false);
  };

  return {
    isReady,
    player,
    isOpen,
    isSwitching,
    onOpenChange: (open: boolean) => {
      setIsOpen(open);

      if (!open) {
        setIsSwitching(false);
      }
    },
    close,
    startSwitch: () => setIsSwitching(true),
    forget: () => {
      forgetOwnPlayer();
      close();
    }
  };
};
