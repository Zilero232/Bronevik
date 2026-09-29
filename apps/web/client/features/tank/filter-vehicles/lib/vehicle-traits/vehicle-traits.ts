import type { TankClass } from '@otmetki/icons';
import type { TankRole } from '@otmetki/schemas';

import { TANK_ROLES } from '@otmetki/schemas';
import { match } from 'ts-pattern';

import type { FilterByTraitsInput, MatchesKindInput, MatchesRolesInput } from './vehicle-traits.types';

import { ROLE_CLASS_PREFIX } from '../../config';

export const matchesKind = ({ kind, vehicle: { isPremium, isCollectible } }: MatchesKindInput): boolean =>
  match(kind)
    .with('all', () => true)
    .with('regular', () => !isPremium && !isCollectible)
    .with('premium', () => isPremium && !isCollectible)
    .with('collector', () => isCollectible)
    .exhaustive();

export const matchesRoles = ({ role, roles }: MatchesRolesInput): boolean => roles.length === 0 || (role !== null && roles.includes(role));

export const filterByTraits = <T>({ rows, vehicleOf, kind, roles, roleOf }: FilterByTraitsInput<T>): T[] =>
  rows.filter((row) => {
    const vehicle = vehicleOf(row);

    return matchesKind({ kind, vehicle }) && (roleOf === null || matchesRoles({ role: roleOf(vehicle.tankId), roles }));
  });

export const rolesForTypes = (types: readonly TankClass[]): TankRole[] =>
  types.length === 0 ? [...TANK_ROLES] : TANK_ROLES.filter((role) => types.some((type) => role.startsWith(ROLE_CLASS_PREFIX[type])));
