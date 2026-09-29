export type DailyBoard<TGuess> = {
  day: string;
  guessIds: TGuess[];
};

type DailyStorageKeys = {
  storageKey: string;
  streakKey: string;
};

export type UseDailyStorageInput = DailyStorageKeys & {
  day: string | null;
};
