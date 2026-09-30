import type { MarksThresholdsProps } from './MarksThresholds.types';

import { LevelNeed } from '../LevelNeed';

import s from './MarksThresholds.module.scss';

export const MarksThresholds = ({ thresholds }: MarksThresholdsProps) => {
  if (thresholds.length === 0) {
    return null;
  }

  return (
    <div className={s.line}>
      {thresholds.map((item) => (
        <span key={item.level} className={s.threshold}>
          <LevelNeed level={item} />
        </span>
      ))}
    </div>
  );
};
