import type { inferParserType } from 'nuqs/server';

import type { BEST_BATTLES_URL_PARSERS } from '../../config';

export type BestBattlesState = inferParserType<typeof BEST_BATTLES_URL_PARSERS>;
