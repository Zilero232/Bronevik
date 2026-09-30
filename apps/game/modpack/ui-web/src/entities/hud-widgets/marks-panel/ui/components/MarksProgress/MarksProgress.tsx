import type { MarksProgressProps } from './MarksProgress.types';

import { ClientIcon, HudText } from '../../../../../../shared/ui/hud';
import { MARKS_PANEL } from '../../../config';

import s from './MarksProgress.module.scss';

export const MarksProgress = ({ step, battles }: MarksProgressProps) => {
  if (step === null && battles === null) {
    return null;
  }

  return (
    <div className={s.line}>
      <HudText className={s.secondary} text={step} />
      {battles !== null && (
        <span className={s.battles}>
          <ClientIcon icon={MARKS_PANEL.battlesGlyph} size={MARKS_PANEL.battlesSize} />
          <span className={s.secondary}>{battles}</span>
        </span>
      )}
    </div>
  );
};
