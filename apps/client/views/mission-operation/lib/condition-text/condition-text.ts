import type { MissionCondition } from '@otmetki/schemas';

import { isIncludedIn } from 'remeda';

import type { ConditionText } from './condition-text.types';

import { CONDITION_MESSAGES } from '../../config';

export const conditionText = (condition: MissionCondition): ConditionText => {
  if (condition.description) {
    return { kind: 'text', text: condition.description };
  }

  if (condition.isHeader && condition.goal !== null) {
    return { kind: 'series', goal: condition.goal, title: condition.title };
  }

  if (isIncludedIn(condition.progressId, CONDITION_MESSAGES)) {
    return { kind: 'message', key: condition.progressId };
  }

  return { kind: 'generic', id: condition.title ?? condition.progressId };
};

export const visibleConditions = (conditions: readonly MissionCondition[]) => ({
  main: conditions.filter((condition) => condition.isMain && condition.isAward),
  honors: conditions.filter((condition) => !condition.isMain && condition.isAward)
});
