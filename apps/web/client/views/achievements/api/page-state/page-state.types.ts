import type { inferParserType } from 'nuqs/server';

import type { ACHIEVEMENTS_PARAMS } from '../../config';

export type AchievementsPrefetchInput = Pick<inferParserType<typeof ACHIEVEMENTS_PARAMS>, 'section' | 'sort'>;
