import type { ModDevice } from '@otmetki/schemas';

export type DeviceListProps = {
  devices: ModDevice[];
  isRevoking: boolean;
  onRevoke: (id: string) => void;
};
