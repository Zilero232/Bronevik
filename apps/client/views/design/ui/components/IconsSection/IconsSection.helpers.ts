import type { VehicleCatalog } from '@bronevik/schemas';

import type { TankIdentityData } from '@/entities/tank/tank';

import { vehicleIdentity } from '@/entities/tank/tank';

import { RENDER_SAMPLES } from './IconsSection.constants';

export const renderSamples = (catalog: VehicleCatalog) => {
  const withRender = catalog.filter((vehicle) => vehicle.images.big && vehicle.images.small && vehicle.images.contour);
  const flagship = withRender.find((vehicle) => !vehicle.isPremium) ?? withRender.at(0);
  const premium = withRender.find((vehicle) => vehicle.isPremium) ?? flagship;

  if (!flagship || !premium) {
    return [];
  }

  const sources = { flagship: vehicleIdentity(flagship), premium: vehicleIdentity(premium) };

  return RENDER_SAMPLES.map(({ key, size, source, withImages }) => {
    const tank: TankIdentityData = withImages ? sources[source] : { ...sources[source], images: null };

    return { key, size, tank };
  });
};
