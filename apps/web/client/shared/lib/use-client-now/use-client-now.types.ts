export type UseClientNowInput = {
  updateInterval?: number;
};

export type NowStore = {
  read: () => Date;
  subscribe: (notify: () => void) => () => void;
};
