export type CodeLifetimeInput = {
  expiresAt: string;
  issuedAt: number;
  now: number;
};

export type CodeLifetime = {
  left: number;
  total: number;
};
