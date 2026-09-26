import type { TankDetail } from '@otmetki/schemas';

export type IsSameTankInput = {
  detail: TankDetail;
  idOrSlug: string;
};
