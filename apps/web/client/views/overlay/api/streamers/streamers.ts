import type { OverlayData } from '@/entities/streamer/streamer';

import { overlaysControllerShow } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getOverlayData = (publicId: string): Promise<OverlayData> => fromSdk(() => overlaysControllerShow({ path: { publicId } }));
