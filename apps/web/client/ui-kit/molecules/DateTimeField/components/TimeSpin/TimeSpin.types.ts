export type TimeSpinProps = {
  value: number | null;
  min: number;
  max: number;
  step?: number;
  label: string;
  decrementLabel: string;
  incrementLabel: string;
  onValueChange: (value: number | null) => void;
};
