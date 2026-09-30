export type UseWheelScrollInput = {
  onScrolled?: () => void;
};

export type WheelScrollRef = (node: HTMLElement | null) => void;
