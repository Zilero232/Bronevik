'use client';

import { Check, Lock, Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { MissionNodeProps } from './MissionNode.types';

import { MISSION_BOARD } from '../../../../../config';
import { useMissionSelection } from '../../../../../model/hooks';

import s from './MissionNode.module.scss';

export const MissionNode = ({ node }: MissionNodeProps) => {
  const t = useTranslations('missions.board');
  const { selectedId, select } = useMissionSelection();
  const { mission, state } = node;

  return (
    <button
      aria-pressed={mission.questId === selectedId}
      className={s.root}
      data-state={state}
      title={mission.title}
      type='button'
      onClick={() => select(mission.questId)}
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
