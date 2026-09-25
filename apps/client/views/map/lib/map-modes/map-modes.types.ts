import type { MapDetail } from '@bronevik/schemas';

export type MapModeView = Pick<MapDetail['gameModes'][number], 'minimap' | 'mode'>;
