import { useTranslations } from 'next-intl';

import { ClassIcon, ProgressRing } from '@/ui-kit';

import type { BranchColumnProps } from './BranchColumn.types';

import { MISSION_BOARD } from '../../../../../config';
import { MissionNode } from '../MissionNode';

import s from './BranchColumn.module.scss';

export const BranchColumn = ({ column, selectedId, isTracked, onSelect }: BranchColumnProps) => {
  const t = useTranslations('missions.board');
  const { branch, label, nodes, done } = column;

  return (
    <div className={s.root} data-class={branch.vehicleType ?? undefined}>
      <header className={s.head}>
        <span className={s.identity}>
          {branch.vehicleType && <ClassIcon size={MISSION_BOARD.classIconSize} tankClass={branch.vehicleType} />}
          <span className={s.text}>
            <span className={s.label}>{label}</span>
            <span className={s.meta}>{t('tiers', { min: branch.minTier, max: branch.maxTier })}</span>
          </span>
        </span>
        {isTracked ? (
          <ProgressRing
            label={t('progress', { done, total: nodes.length })}
            max={Math.max(nodes.length, 1)}
            size={MISSION_BOARD.ringSize}
            thickness={MISSION_BOARD.ringThickness}
            value={done}
          >
            <span className={s.ringValue}>{done}</span>
          </ProgressRing>
        ) : (
          <span className={s.count}>{t('count', { count: nodes.length })}</span>
        )}
      </header>
      <ol className={s.list}>
        {nodes.map((node) => (
          <li key={node.mission.questId} className={s.item}>
            <MissionNode isSelected={node.mission.questId === selectedId} node={node} onSelect={onSelect} />
          </li>
        ))}
      </ol>
    </div>
  );
};
