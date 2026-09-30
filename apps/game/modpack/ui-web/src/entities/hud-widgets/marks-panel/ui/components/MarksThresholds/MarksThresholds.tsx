import type { MarksThresholdsProps } from './MarksThresholds.types';

import { HudText } from '../../../../../../shared/ui/hud';
import { LevelNeed } from '../LevelNeed';

import s from './MarksThresholds.module.scss';

export const MarksThresholds = ({ thresholds, step }: MarksThresholdsProps) => {
  if (thresholds.length === 0 && step === null) {
    return null;
  }

  return (
    <div className={s.line}>
      {thresholds.map((item) => (
        <span key={item.level} className={s.threshold}>
          <LevelNeed level={item} />
        </span>
      ))}
      <HudText className={s.step} text={step} />
    </div>
  );
};
