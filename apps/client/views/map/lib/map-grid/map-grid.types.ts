export type SquareAtInput = {
  x: number;
  y: number;
};

export type SquareLabelInput = {
  row: number;
  column: number;
};

export type MapSquare = SquareLabelInput & {
  label: string;
};
