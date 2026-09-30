import type { LevelNeedProps } from './LevelNeed.types';

import { Glyph } from '../../../../../../shared/ui/hud';
import { MARKS_PANEL } from '../../../config';

import s from './LevelNeed.module.scss';

export const LevelNeed = ({ level }: LevelNeedProps) => (
  <>
    <span className={s.level}>{level.label}</span>
    {level.reached ? (
      <Glyph name={MARKS_PANEL.checkGlyph} size={MARKS_PANEL.checkSize} tone='success' />
    ) : (
      <span className={s.need}>{level.value}</span>
    )}
  </>
);
