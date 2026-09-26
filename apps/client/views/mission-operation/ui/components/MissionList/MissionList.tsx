import type { MissionListProps } from './MissionList.types';

import { MissionRow } from './components';

import s from './MissionList.module.scss';

export const MissionList = ({ missions, selectedId, progressOf, onSelect }: MissionListProps) => (
  <ol className={s.root}>
    {missions.map((mission) => (
      <li key={mission.questId}>
        <MissionRow isSelected={mission.questId === selectedId} mission={mission} progress={progressOf(mission.questId)} onSelect={onSelect} />
      </li>
    ))}
  </ol>
);
