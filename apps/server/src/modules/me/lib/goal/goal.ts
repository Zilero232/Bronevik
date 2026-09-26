import { addDays } from 'date-fns';

import type { GoalEndInput } from './goal.types';

import { GOALS } from '../../config';

export const isGoalEndAllowed = ({ endsAt, now }: GoalEndInput): boolean => endsAt > now && endsAt <= addDays(now, GOALS.maxDurationDays);
