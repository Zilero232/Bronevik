export type SegmentedItem<T extends string = string> = {
  value: T;
  label: string;
};

export type SegmentedProps<T extends string = string> = {
  items: readonly SegmentedItem<T>[];
  value: T;
  wrap?: boolean;
  className?: string;
  onSelect: (value: T) => void;
};
