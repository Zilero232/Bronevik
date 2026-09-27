'use client';

import { vehicleIdentity } from '@/entities/tank/tank';

import type { TankProviderProps } from './TankProvider.types';

import { TankContext } from '../../../model/context';

export const TankProvider = ({ detail, children }: TankProviderProps) => {
  const { vehicle } = detail;

  return <TankContext value={{ detail, identity: vehicleIdentity(vehicle), tankId: vehicle.tankId, slug: vehicle.slug }}>{children}</TankContext>;
};
