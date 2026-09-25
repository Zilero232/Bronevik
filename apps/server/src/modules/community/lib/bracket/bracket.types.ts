export type BracketMatch = {
  round: number;
  index: number;
  a: number | null;
  b: number | null;
  winner: number | null;
};

export type Bracket = {
  size: number;
  rounds: BracketMatch[][];
};

export type ReportWinnerInput = {
  bracket: Bracket;
  round: number;
  index: number;
  winner: number;
};

export type PlaceWinnerInput = {
  rounds: BracketMatch[][];
  round: number;
  index: number;
  winner: number | null;
};
