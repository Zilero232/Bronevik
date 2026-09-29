import { NATION_ICONS, NATIONS, TANK_CLASS_ICONS, TANK_CLASSES } from '@otmetki/icons';

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

  if (!nation) {
    return null;
  }

  const Flag = NATION_ICONS[nation];

  return <Flag aria-hidden className={s.flag} palette='color' size={ICON_FILTER_GLYPH.size} />;
};
