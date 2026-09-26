import type {
  CreateGuide,
  Guide,
  GuideAuthors,
  GuideBySlugInput,
  GuideList,
  GuideListInput,
  GuidePage,
  LikeResult,
  UpdateGuideInput
} from './guides.types';

import {
  guidesControllerAuthors,
  guidesControllerCreate,
  guidesControllerGet,
  guidesControllerLike,
  guidesControllerList,
  guidesControllerMine,
  guidesControllerRemove,
  guidesControllerUnlike,
  guidesControllerUpdate
} from '../generated';
import { SESSION_REQUEST } from '../http';
import { fromSdk } from '../source';

export const listGuides = ({ signal, ...query }: GuideListInput): Promise<GuidePage> =>
  fromSdk(() => guidesControllerList({ ...SESSION_REQUEST, query, signal }));

export const getGuideAuthors = (signal?: AbortSignal): Promise<GuideAuthors> => fromSdk(() => guidesControllerAuthors({ signal }));

export const getMyGuides = (signal?: AbortSignal): Promise<GuideList> => fromSdk(() => guidesControllerMine({ ...SESSION_REQUEST, signal }));

export const getGuide = ({ slug, signal }: GuideBySlugInput): Promise<Guide> =>
  fromSdk(() => guidesControllerGet({ ...SESSION_REQUEST, path: { slug }, signal }));

export const createGuide = (body: CreateGuide): Promise<Guide> => fromSdk(() => guidesControllerCreate({ ...SESSION_REQUEST, body }));

export const updateGuide = ({ id, body }: UpdateGuideInput): Promise<Guide> =>
  fromSdk(() => guidesControllerUpdate({ ...SESSION_REQUEST, path: { id }, body }));

export const removeGuide = async (id: string): Promise<void> => {
  await fromSdk(() => guidesControllerRemove({ ...SESSION_REQUEST, path: { id } }));
};

export const likeGuide = (id: string): Promise<LikeResult> => fromSdk(() => guidesControllerLike({ ...SESSION_REQUEST, path: { id } }));

export const unlikeGuide = (id: string): Promise<LikeResult> => fromSdk(() => guidesControllerUnlike({ ...SESSION_REQUEST, path: { id } }));
