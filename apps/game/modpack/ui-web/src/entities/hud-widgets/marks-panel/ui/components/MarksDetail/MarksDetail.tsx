import type { MarksDetailProps } from './MarksDetail.types';

import { HudText } from '../../../../../../shared/ui/hud';

import s from './MarksDetail.module.scss';

export const MarksDetail = ({ detail }: MarksDetailProps) => {
  if (detail === null) {
    return null;
  }

  return (
    <div className={s.line}>
      <span className={s.level}>{detail.label}</span>
      <span className={s.secondary}>{detail.average}</span>
      <HudText className={s.secondary} text={detail.target} />
    </div>
  );
};
