import clsx from 'clsx';

import type { MarksMainProps } from './MarksMain.types';

import { ClientIcon, Glyph, HudText, toneClass } from '../../../../../../shared/ui/hud';
import { MARKS_PANEL } from '../../../config';
import { LevelNeed } from '../LevelNeed';

import s from './MarksMain.module.scss';

export const MarksMain = ({ view, color }: MarksMainProps) => (
  <div className={s.main}>
    <ClientIcon icon={view.mark} size={MARKS_PANEL.markSize} />
    <span className={s.percent} style={{ color }}>
      {view.percent}
    </span>
    <HudText className={clsx(s.delta, toneClass(view.deltaTone))} text={view.delta} />
    {view.up !== null && (
      <span className={s.up}>
        <Glyph name={MARKS_PANEL.upGlyph} size={MARKS_PANEL.upSize} tone='muted' />
        <LevelNeed level={view.up} />
      </span>
    )}
    {view.source !== null && <span className={clsx(s.badge, toneClass(view.source.tone))}>{view.source.label}</span>}
  </div>
);
