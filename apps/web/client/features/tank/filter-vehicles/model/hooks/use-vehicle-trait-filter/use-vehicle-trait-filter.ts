'use client';

import type { VehicleCatalogItem } from '@otmetki/schemas';

import { useQuery } from '@tanstack/react-query';
import { indexBy } from 'remeda';

import { vehicleCatalogQuery } from '@/entities/tank/tank';

import type { TraitRowsInput } from '../../../lib';

import { filterByTraits } from '../../../lib';
import { useVehicleFilters } from '../use-vehicle-filters';

export const useVehicleTraitFilter = () => {
  const {
    filters: { premium, roles }
  } = useVehicleFilters();

  const { data: catalog } = useQuery({ ...vehicleCatalogQuery(), enabled: roles.length > 0 });

  const byId: Partial<Record<number, VehicleCatalogItem>> | null = catalog === undefined ? null : indexBy(catalog, (vehicle) => vehicle.tankId);
  const roleOf = byId === null || roles.length === 0 ? null : (tankId: number) => byId[tankId]?.role ?? null;

  return <T>({ rows, vehicleOf }: TraitRowsInput<T>): T[] => filterByTraits({ rows, vehicleOf, kind: premium, roles, roleOf });
};
