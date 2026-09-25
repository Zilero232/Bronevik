import type { TankComparison, VehicleStats } from '@bronevik/schemas';

import { findMockVehicle, mockVehicleSummary } from '@/shared/mocks';

import type { CompareTanksInput } from './tanks.types';

import { mockVehicleStats } from './tank-detail.mock';

const flatSpecs = ({ shells, modules: _modules, shell: _shell, clip: _clip, ...rest }: VehicleStats): Record<string, number | null> => ({
  ...Object.fromEntries(Object.entries(rest).filter((entry): entry is [string, number] => typeof entry[1] === 'number')),
  ...Object.fromEntries(
    shells.flatMap((item, index) =>
      Object.entries(item).flatMap(([key, value]) => (typeof value === 'number' ? [[`shells.${index}.${key}`, value] as const] : []))
    )
  )
});

export const mockCompareTanks = ({ tankIds }: CompareTanksInput): TankComparison => {
  const vehicles = tankIds.flatMap((tankId) => {
    const tank = findMockVehicle(tankId);

    return tank ? [{ vehicle: mockVehicleSummary(tank), profileId: 'top', specs: flatSpecs(mockVehicleStats({ tank, profile: 'top' })) }] : [];
  });

  const keys = [...new Set(vehicles.flatMap(({ specs }) => Object.keys(specs)))];
  const best = Object.fromEntries(
    keys.map((key) => {
      const winner = vehicles.reduce<(typeof vehicles)[number] | null>(
        (current, candidate) => ((candidate.specs[key] ?? -Infinity) > (current?.specs[key] ?? -Infinity) ? candidate : current),
        null
      );

      return [key, vehicles.length > 1 ? (winner?.vehicle.tankId ?? null) : null];
    })
  );

  return { vehicles, best };
};
