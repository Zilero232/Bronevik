import type { Loadout, PopularBuild } from '@otmetki/schemas';

import type { IdsIntoInput } from './popular-loadout.types';

import { emptyLoadout } from '../loadout-code';

const idsInto = ({ slots, ids }: IdsIntoInput) => slots.map((_, index) => ids[index] ?? null);

export const buildKey = ({ optionalDevices, consumables, directives }: PopularBuild): string =>
  [optionalDevices, consumables, directives].map((items) => items.map(({ id }) => id).join('.')).join('|');

export const popularLoadout = ({ optionalDevices, consumables, directives }: PopularBuild): Loadout => {
  const empty = emptyLoadout();

  return {
    ...empty,
    equipment: idsInto({ slots: empty.equipment, ids: optionalDevices.map(({ id }) => id) }),
    consumables: idsInto({ slots: empty.consumables, ids: consumables.map(({ id }) => id) }),
    directives: idsInto({ slots: empty.directives, ids: directives.map(({ id }) => id) })
  };
};
