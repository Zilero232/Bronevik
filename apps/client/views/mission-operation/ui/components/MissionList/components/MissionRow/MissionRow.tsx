import { Check, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MissionRowProps } from './MissionRow.types';

import s from './MissionRow.module.scss';

export const MissionRow = ({ mission, progress, isSelected, onSelect }: MissionRowProps) => {
  const t = useTranslations('missions.mission');

  return (
    <button
      aria-pressed={isSelected}
      className={s.root}
      data-done={progress?.done || undefined}
      type='button'
      onClick={() => onSelect(mission.questId)}
    >
      <span className={s.position}>{mission.position}</span>
      <span className={s.title}>{mission.title}</span>
      <span className={s.state}>
        {progress?.honors && <Star aria-label={t('withHonors')} size={14} />}
        {progress?.done && !progress.honors && <Check aria-label={t('done')} size={14} />}
      </span>
    </button>
  );
};
