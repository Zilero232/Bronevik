import type { CollectorHealth } from '@otmetki/schemas';

export type CollectorJobsProps = Pick<CollectorHealth, 'jobs' | 'lastModBattleAt'>;
