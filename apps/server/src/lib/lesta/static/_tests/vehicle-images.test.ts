import { describe, expect, it } from 'vitest';

import { vehicleImages } from '../vehicle-images';

describe('vehicleImages', () => {
  it('builds the static encyclopedia urls from nation and tag', () => {
    expect(vehicleImages({ nation: 'ussr', tag: 'R106_KV85' })).toEqual({
      big_icon: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/vehicle/ussr-R106_KV85.png',
      small_icon: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/vehicle/small/ussr-R106_KV85.png',
      contour_icon: 'https://api.tanki.su/static/2.80.0/wot/encyclopedia/vehicle/contour/ussr-R106_KV85.png'
    });
  });
});
