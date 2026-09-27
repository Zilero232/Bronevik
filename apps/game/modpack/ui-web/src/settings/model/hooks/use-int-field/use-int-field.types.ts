export type IntFieldInput = {
  value: number;
  min: number | null;
  max: number | null;
  onCommit: (next: number) => void;
};
