export type ToggleChip = {
  value: string;
  label: string;
  count?: number;
};

export type ToggleChipsProps = {
  label: string;
  chips: readonly ToggleChip[];
  value: string;
  onChange: (value: string) => void;
};
