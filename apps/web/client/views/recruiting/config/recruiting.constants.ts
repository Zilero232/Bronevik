export const RECRUITING_KINDS = ['clan_seeks_player', 'player_seeks_clan'] as const;

export const RECRUITING_OFFICER_ROLES = ['commander', 'executive_officer', 'personnel_officer', 'recruitment_officer', 'combat_officer'] as const;

export const RECRUITING_BOARD = {
  pageSize: 20,
  defaultKind: 'clan_seeks_player',
  expiresOptions: [3, 7, 14, 30, 60],
  defaultExpiresInDays: 14,
  bodyRows: 6
} as const;
