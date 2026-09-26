import type { RatingTier } from '@otmetki/ratings';

export type TierRoles = Partial<Record<RatingTier, string>>;

export type RoleBinding = {
  clanId: bigint;
  memberRoleId: string | null;
  tierRoles: TierRoles;
};

export type MemberStanding = {
  clanId: bigint | null;
  wn8: number | null;
};

export type DesiredRolesInput = {
  binding: RoleBinding;
  member: MemberStanding;
};

export type RoleChangesInput = {
  binding: RoleBinding;
  granted: readonly string[];
  desired: readonly string[];
};

export type RoleChanges = {
  add: string[];
  remove: string[];
};
