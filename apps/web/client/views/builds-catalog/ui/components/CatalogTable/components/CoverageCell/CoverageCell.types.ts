import type { BuildsCatalogEntry } from '@otmetki/schemas';

export type CoverageCellProps = Pick<BuildsCatalogEntry, 'battles' | 'isEnough' | 'players'>;
