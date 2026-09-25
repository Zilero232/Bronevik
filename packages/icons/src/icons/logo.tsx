import { createIcon } from '../lib';
import { LOGO_SHAPES } from './logo.shapes';

export const BronevikLogoIcon = createIcon({
  name: 'bronevik-logo',
  children: (
    <>
      <path d={LOGO_SHAPES.plate} />
      <path d={LOGO_SHAPES.letter} />
    </>
  )
});
