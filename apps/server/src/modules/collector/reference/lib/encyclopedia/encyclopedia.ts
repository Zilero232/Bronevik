import slugifyText from '@sindresorhus/slugify';
import { flatten } from 'flat';
import { entries, isNumber } from 'remeda';

import type { ModuleType, ProvisionType, VehicleType } from '../../../../../../generated';
import type { Vehicle } from '../../../../../lib/lesta';
import type { SpecChange, SpecDiffInput, VehicleSlugsInput } from './encyclopedia.types';

import { readRecord, VEHICLE_TYPE_TO_DB } from '../../../../../common/lib';
import { MODULE_TYPES, PROVISION_TYPES, SPEC_DIFF } from './encyclopedia.constants';

const isKey = <T extends object>(table: T, key: string): key is Extract<keyof T, string> => Object.hasOwn(table, key);

export const toVehicleType = (value: string): VehicleType | null => (isKey(VEHICLE_TYPE_TO_DB, value) ? VEHICLE_TYPE_TO_DB[value] : null);

export const toProvisionType = (value: string | null | undefined): ProvisionType | null =>
  value && isKey(PROVISION_TYPES, value) ? PROVISION_TYPES[value] : null;

export const toModuleType = (value: string | null | undefined): ModuleType | null => MODULE_TYPES.find((type) => type === value) ?? null;

export const slugify = (value: string): string => slugifyText(value, { decamelize: false });

export const vehicleSlugs = ({ vehicles }: VehicleSlugsInput): Map<number, string> => {
  const taken = new Set<string>();
  const slugs = new Map<number, string>();

  for (const vehicle of [...vehicles].sort((left, right) => left.tank_id - right.tank_id)) {
    const base = slugify(vehicle.tag ?? '') || `tank-${vehicle.tank_id}`;
    const slug = taken.has(base) ? `${base}-${vehicle.tank_id}` : base;

    taken.add(slug);
    slugs.set(vehicle.tank_id, slug);
  }

  return slugs;
};

export const previousTankIds = (vehicles: readonly Pick<Vehicle, 'next_tanks' | 'tank_id'>[]): Map<number, number[]> => {
  const previous = new Map<number, number[]>();

  for (const vehicle of vehicles) {
    for (const next of Object.keys(vehicle.next_tanks ?? {})) {
      const nextId = Number(next);
      const list = previous.get(nextId) ?? [];

      list.push(vehicle.tank_id);
      previous.set(nextId, list);
    }
  }

  return previous;
};

const numericLeaves = (value: unknown): Map<string, number> =>
  new Map(
    entries(flatten<Record<string, unknown>, Record<string, unknown>>(readRecord(value), { maxDepth: SPEC_DIFF.maxDepth, safe: true })).flatMap(
      ([key, leaf]): [string, number][] => (isNumber(leaf) && Number.isFinite(leaf) ? [[key, leaf]] : [])
    )
  );

export const specDiff = ({ previous, next }: SpecDiffInput): Record<string, SpecChange> | null => {
  const before = numericLeaves(previous);
  const after = numericLeaves(next);
  const changes: Record<string, SpecChange> = {};

  for (const key of new Set([...before.keys(), ...after.keys()])) {
    const from = before.get(key) ?? null;
    const to = after.get(key) ?? null;

    if (from !== to) {
      changes[key] = { from, to };
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
};

export const keyedEntries = (value: unknown): [string, unknown][] =>
  Array.isArray(value) ? value.map((item, index): [string, unknown] => [String(index), item]) : Object.entries(readRecord(value));
