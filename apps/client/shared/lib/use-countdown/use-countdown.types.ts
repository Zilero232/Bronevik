export type UseCountdownInput = {
  seconds: (now: Date) => number;
  onExpire?: () => void;
};

export type Countdown = {
  left: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};
