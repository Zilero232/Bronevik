import type { LearningBucket } from '@otmetki/schemas';

export const bucketLabel = ({ from, to }: Pick<LearningBucket, 'from' | 'to'>): string => (to === null ? `${from}+` : `${from}–${to}`);
