import { Bell } from 'lucide-react';

import type { BellGlyphProps } from './BellGlyph.types';

import { INBOX_BELL } from '../../../config';

import s from './BellGlyph.module.scss';

export const BellGlyph = ({ unread }: BellGlyphProps) => (
  <span className={s.root}>
    <Bell size={16} />
    {unread > 0 && (
      <span aria-hidden className={s.badge}>
        {unread > INBOX_BELL.badgeMax ? `${INBOX_BELL.badgeMax}+` : unread}
      </span>
    )}
  </span>
);
