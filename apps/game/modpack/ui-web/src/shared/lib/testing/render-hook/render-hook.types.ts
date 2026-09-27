export type HookHandle<Result> = {
  current: () => Result;
  run: (callback: () => void) => void;
  settle: () => Promise<void>;
  unmount: () => void;
};
