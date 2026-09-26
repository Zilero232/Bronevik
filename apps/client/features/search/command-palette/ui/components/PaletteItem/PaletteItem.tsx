import { Command } from 'cmdk';

import type { PaletteItemProps } from './PaletteItem.types';

import s from './PaletteItem.module.scss';

export const PaletteItem = ({ value, icon, title, meta, trailing, onSelect }: PaletteItemProps) => (
  <Command.Item className={s.root} value={value} onSelect={onSelect}>
    {icon && <span className={s.icon}>{icon}</span>}
    <span className={s.text}>
      <span className={s.title}>{title}</span>
      {meta && <span className={s.meta}>{meta}</span>}
    </span>
    {trailing && <span className={s.trailing}>{trailing}</span>}
  </Command.Item>
);
