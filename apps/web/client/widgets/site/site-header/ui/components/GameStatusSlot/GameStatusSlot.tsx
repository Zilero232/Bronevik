'use client';

import { clsx } from 'clsx';

import { GameVersionBadge, ServiceStatus } from '@/ui-kit';

import type { GameStatusSlotProps } from './GameStatusSlot.types';

import { useGameStatus } from '../../../model/hooks';

import s from './GameStatusSlot.module.scss';

export const GameStatusSlot = ({ className }: GameStatusSlotProps) => {
  const { version, status } = useGameStatus();

  return (
    <div className={clsx(s.root, className)}>
      <GameVersionBadge version={version} />
      <ServiceStatus status={status} />
    </div>
  );
};
