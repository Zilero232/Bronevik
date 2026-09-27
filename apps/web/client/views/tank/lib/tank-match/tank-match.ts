import type { IsSameTankInput } from './tank-match.types';

export const isSameTank = ({ detail, idOrSlug }: IsSameTankInput) => detail.vehicle.slug === idOrSlug || String(detail.vehicle.tankId) === idOrSlug;
