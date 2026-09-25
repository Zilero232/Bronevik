export type CountdownInput = {
  expiresAt: string;
  issuedAt: number;
  now: number;
};

export type Countdown = {
  left: number;
  ratio: number;
  label: string;
  isExpired: boolean;
};
