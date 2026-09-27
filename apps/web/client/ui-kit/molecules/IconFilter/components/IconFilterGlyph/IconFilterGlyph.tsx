import { NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES, toRoman } from '@otmetki/icons';

import { tierBand } from '@/shared/lib';

import type { IconFilterGlyphProps } from './IconFilterGlyph.types';

import { ICON_FILTER_GLYPH } from './IconFilterGlyph.constants';

import s from './IconFilterGlyph.module.scss';

export const IconFilterGlyph = ({ value }: IconFilterGlyphProps) => {
  const tankClass = TANK_CLASSES.find((item) => item === value);
  const nation = NATIONS.find((item) => item === value);

  if (tankClass) {
    const Icon = TANK_CLASS_ICONS[tankClass];

    return <Icon aria-hidden className={s.glyph} size={ICON_FILTER_GLYPH.size} />;
  }

  if (nation) {
    const Flag = NATION_ICONS[nation];

    return <Flag aria-hidden className={s.flag} palette='color' size={ICON_FILTER_GLYPH.size} />;
  }

  return (
    <span aria-hidden className={s.hex} data-tier-band={tierBand(Number(value))}>
      <svg className={s.hexShape} viewBox={ICON_FILTER_GLYPH.hexViewBox}>
        <polygon points={ICON_FILTER_GLYPH.hexPoints} />
      </svg>
      <span className={s.numeral}>{toRoman(Number(value))}</span>
    </span>
  );
};
