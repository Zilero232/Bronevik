import { createIcon } from '../lib';
import { LOGO_SHAPES } from './logo.shapes';

export const OtmetkiLogoIcon = createIcon({
  name: 'otmetki-logo',
  children: (
    <>
      {LOGO_SHAPES.marks.map((d) => (
        <path key={d} d={d} />
      ))}
    </>
  )
});
