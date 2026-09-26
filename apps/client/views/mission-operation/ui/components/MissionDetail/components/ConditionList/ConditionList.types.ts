import type { MissionCondition } from '@otmetki/schemas';
import type { ReactNode } from 'react';

export type ConditionListProps = {
  title: ReactNode;
  conditions: MissionCondition[];
};
