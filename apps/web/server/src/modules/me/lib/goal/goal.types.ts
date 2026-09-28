export type GoalEndInput = {
  endsAt: Date;
  now: Date;
};

export type GoalWindowInput = {
  startsAt: Date;
  endsAt: Date;
  now: Date;
};

export type GoalWindow = {
  from: Date;
  to: Date;
};

export type GoalBattlesInput = {
  modBattles: number;
  apiBattles: number | null;
};
