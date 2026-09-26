export const COMPETITION_METRICS = ['damage', 'assist', 'blocked', 'frags', 'spotted', 'xp', 'win', 'survive'] as const;

export const COMPETITION_MODES = ['random', 'onslaught', 'frontline', 'ranked', 'steelHunter'] as const;

export const COMPETITION_STATUSES = ['upcoming', 'running', 'finished'] as const;

export const COMPETITION_VISIBILITIES = ['public', 'private'] as const;

export const COMPETITION_SOURCES = ['mod', 'snapshots', 'none'] as const;

export const COMPETITION = {
  titleMax: 80,
  descriptionMax: 1000,
  teamNameMax: 32,
  maxTeamSize: 3,
  maxTeams: 64,
  battles: { min: 1, max: 100, default: 10 },
  maxDurationDays: 31,
  weightMax: 10_000,
  defaultScoring: { damage: 1, assist: 0.5, blocked: 0.25, frags: 300, spotted: 100, xp: 0, win: 500, survive: 200 },
  inviteCodeLength: 8
} as const;
