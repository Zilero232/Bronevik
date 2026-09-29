export type GuessStreak = {
  current: number;
  best: number;
  played: number;
  wins: number;
  lastDay: string | null;
};

export type RecordResultInput = {
  streak: GuessStreak;
  day: string;
  isWon: boolean;
};

export type ActiveStreakInput = {
  streak: GuessStreak;
  today: string;
};
