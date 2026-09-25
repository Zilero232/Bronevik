import { entries } from 'remeda';

import { SERVER_PERIOD_DAYS, SERVER_PERIOD_TO_DB } from '../../../../../common/lib';

export const SERVER_STATS_PERIODS = entries(SERVER_PERIOD_TO_DB).map(([key, period]) => ({ period, days: SERVER_PERIOD_DAYS[key] }));

export const ALL_COHORTS = 'all';
