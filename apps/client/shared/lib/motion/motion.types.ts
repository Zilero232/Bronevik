export type BurstInput = {
  count: number;
  radius: number;
  spread?: number;
};

export type BurstParticle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
};
