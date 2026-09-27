import type { ProvisionPick } from '@otmetki/schemas';

export type PickListProps = {
  picks: readonly ProvisionPick[];
  title?: string;
};
