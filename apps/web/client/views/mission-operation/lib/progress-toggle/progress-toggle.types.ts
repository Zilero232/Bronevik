export type ProgressState = {
  done: boolean;
  honors: boolean;
};

export type ProgressToggleInput = {
  current: ProgressState;
  field: keyof ProgressState;
  checked: boolean;
};
