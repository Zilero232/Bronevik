import type { TankDetail } from '@bronevik/schemas';

export type IsSameTankInput = {
  detail: TankDetail;
  idOrSlug: string;
};
