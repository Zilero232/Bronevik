import type { MapDetail } from '@otmetki/schemas';

export type MapModeView = Pick<MapDetail['gameModes'][number], 'minimap' | 'mode'>;
