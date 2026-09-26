import type { HEATMAP_SCOPES } from '../../../config';

export type HeatmapScope = (typeof HEATMAP_SCOPES)[number];

export type HeatmapModeChoice = 'all' | 'replay';
