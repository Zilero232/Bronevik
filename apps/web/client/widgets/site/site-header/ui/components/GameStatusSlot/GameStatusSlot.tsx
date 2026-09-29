'use client';

import { clsx } from 'clsx';

import { GameVersionBadge, ServiceStatus } from '@/ui-kit';

import type { GameStatusSlotProps } from './GameStatusSlot.types';

import { useGameStatus } from '../../../model/hooks';

import s from './GameStatusSlot.module.scss';

export const GameStatusSlot = ({ isServiceShown = true, className }: GameStatusSlotProps) => {
  const { version, status } = useGameStatus();

  return (
    <div className={clsx(s.root, className)}>
      <GameVersionBadge version={version} />
      {isServiceShown && <ServiceStatus status={status} />}
    </div>
  );
};
