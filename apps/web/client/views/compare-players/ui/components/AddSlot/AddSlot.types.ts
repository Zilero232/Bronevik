export type AddSlotProps = {
  index: number;
  excludeIds: readonly number[];
  onAdd: (accountId: number) => void;
};
