import type { ImageUrlInput, VehicleImageInput, VehicleImages } from './static.types';

import { LESTA_STATIC } from './static.constants';

const imageUrl = ({ path, file }: ImageUrlInput) => `${LESTA_STATIC.encyclopediaUrl}/${path}/${file}.png`;

export const vehicleImages = ({ nation, tag }: VehicleImageInput): VehicleImages => {
  const file = `${nation}-${tag}`;
  const { vehicleImagePath } = LESTA_STATIC;

  return {
    big_icon: imageUrl({ path: vehicleImagePath.big_icon, file }),
    small_icon: imageUrl({ path: vehicleImagePath.small_icon, file }),
    contour_icon: imageUrl({ path: vehicleImagePath.contour_icon, file })
  };
};
