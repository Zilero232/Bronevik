export type UseCountdownInput = {
  seconds: (now: Date) => number;
  onExpire?: () => void;
  updateInterval?: number;
};

export type Countdown = {
  left: number;
  isExpired: boolean;
};
