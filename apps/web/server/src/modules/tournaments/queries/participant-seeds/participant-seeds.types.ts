export type ParticipantSeedsSqlInput = {
  tournamentId: string;
  seededAccountIds: readonly bigint[];
};
