import { Check, Lock, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MissionNodeProps } from './MissionNode.types';

import { MISSION_BOARD } from '../../../../../config';

import s from './MissionNode.module.scss';

export const MissionNode = ({ node, isSelected, onSelect }: MissionNodeProps) => {
  const t = useTranslations('missions.board');
  const { mission, state } = node;

  return (
    <button
      aria-pressed={isSelected}
      className={s.root}
      data-state={state}
      title={mission.title}
      type='button'
      onClick={() => onSelect(mission.questId)}
    >
      <span aria-hidden className={s.dot}>
        {state === 'honors' && <Star size={MISSION_BOARD.nodeIconSize} />}
        {state === 'done' && <Check size={MISSION_BOARD.nodeIconSize} />}
        {state === 'locked' && <Lock size={MISSION_BOARD.nodeIconSize} />}
        {(state === 'current' || state === 'available') && mission.position}
      </span>
      <span className={s.title}>{mission.shortTitle ?? mission.title}</span>
      <span className={s.state}>{t(`state.${state}`)}</span>
    </button>
  );
};
