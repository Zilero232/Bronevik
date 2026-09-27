import { guidesControllerAuthors, guidesControllerGet, guidesControllerList, guidesControllerMine } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

import type { Guide, GuideAuthors, GuideBySlugInput, GuideList, GuideListInput, GuidePage } from './guides.types';

export const listGuides = ({ signal, ...query }: GuideListInput): Promise<GuidePage> =>
  fromSdk(() => guidesControllerList({ ...SESSION_REQUEST, query, signal }));

export const getGuideAuthors = (signal?: AbortSignal): Promise<GuideAuthors> => fromSdk(() => guidesControllerAuthors({ signal }));

export const getMyGuides = (signal?: AbortSignal): Promise<GuideList> => fromSdk(() => guidesControllerMine({ ...SESSION_REQUEST, signal }));

export const getGuide = ({ slug, signal }: GuideBySlugInput): Promise<Guide> =>
  fromSdk(() => guidesControllerGet({ ...SESSION_REQUEST, path: { slug }, signal }));
