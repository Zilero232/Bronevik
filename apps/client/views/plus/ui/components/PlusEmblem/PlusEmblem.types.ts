export type EmblemPoint = {
  x: number;
  y: number;
};

export type PolarInput = {
  angle: number;
  radius: number;
};

export type LaurelLeaf = EmblemPoint & {
  id: number;
  rotate: number;
  scale: number;
};

export type PlusEmblemProps = {
  className?: string;
};
