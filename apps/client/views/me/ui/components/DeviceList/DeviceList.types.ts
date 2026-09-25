import type { ModDevice } from '@bronevik/schemas';

export type DeviceListProps = {
  devices: ModDevice[];
  isRevoking: boolean;
  onRevoke: (id: string) => void;
};
