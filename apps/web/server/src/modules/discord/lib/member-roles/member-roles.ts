import { RATING_TIERS, ratingTier } from '@otmetki/ratings';
import { isNonNullish, unique, values } from 'remeda';
import { z } from 'zod';

import type { DesiredRolesInput, RoleBinding, RoleChanges, RoleChangesInput, TierRoles } from './member-roles.types';

const tierRolesSchema = z.partialRecord(z.enum(RATING_TIERS), z.string().regex(/^\d+$/));

export const readTierRoles = (raw: unknown): TierRoles => tierRolesSchema.safeParse(raw).data ?? {};

const managedRoles = ({ memberRoleId, tierRoles }: RoleBinding): string[] => unique([memberRoleId, ...values(tierRoles)].filter(isNonNullish));

export const desiredRoles = ({ binding, member }: DesiredRolesInput): string[] => {
  const clanRole = member.clanId === binding.clanId ? binding.memberRoleId : null;
  const tierRole = member.wn8 === null ? null : binding.tierRoles[ratingTier({ scale: 'wn8', value: member.wn8 })];

  return [clanRole, tierRole].filter(isNonNullish);
};

export const roleChanges = ({ binding, granted, desired }: RoleChangesInput): RoleChanges => {
  const managed = managedRoles(binding);

  return {
    add: desired.filter((role) => !granted.includes(role)),
    remove: granted.filter((role) => managed.includes(role) && !desired.includes(role))
  };
};
