export type UseWindowEventInput<Type extends keyof WindowEventMap> = {
  type: Type;
  handler: (event: WindowEventMap[Type]) => void;
};
