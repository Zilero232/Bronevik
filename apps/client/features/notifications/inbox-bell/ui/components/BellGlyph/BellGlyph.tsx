'use client';

import { Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import type { BellGlyphProps } from './BellGlyph.types';

import { INBOX_BELL } from '../../../config';
import { BADGE_MOTION, BELL_SWING, COUNT_MOTION } from './BellGlyph.motion';

import s from './BellGlyph.module.scss';

export const BellGlyph = ({ unread }: BellGlyphProps) => {
  const hasUnread = unread > 0;
  const label = unread > INBOX_BELL.badgeMax ? `${INBOX_BELL.badgeMax}+` : String(unread);

  return (
    <span className={s.root}>
      <motion.span key={unread} animate={hasUnread ? BELL_SWING.keyframes : undefined} className={s.bell} transition={BELL_SWING.transition}>
        <Bell size={19} />
      </motion.span>
      <AnimatePresence>
        {hasUnread && (
          <motion.span aria-hidden className={s.badge} {...BADGE_MOTION}>
            <AnimatePresence initial={false} mode='popLayout'>
              <motion.span key={label} className={s.count} {...COUNT_MOTION}>
                {label}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};
