import clsx from 'clsx';

import type { LevelNeedProps } from './LevelNeed.types';

import { Glyph } from '../../../../../../shared/ui/hud';
import { MARKS_PANEL } from '../../../config';

import s from './LevelNeed.module.scss';

export const LevelNeed = ({ level, needClassName }: LevelNeedProps) => (
  <span className={s.item}>
    <span className={s.level}>{level.label}</span>
    {level.reached ? (
      <Glyph name={MARKS_PANEL.checkGlyph} size={MARKS_PANEL.checkSize} tone='good' />
    ) : (
      <span className={clsx(s.need, needClassName)}>{level.value}</span>
    )}
  </span>
);
