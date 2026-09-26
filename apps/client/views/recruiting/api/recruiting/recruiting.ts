import type { CreateRecruiting, ListRecruitingInput, RecruitingPage, RecruitingPost } from './recruiting.types';

import { recruitingControllerCloseRecruiting, recruitingControllerCreateRecruiting, recruitingControllerListRecruiting } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const listRecruiting = ({ signal, ...query }: ListRecruitingInput): Promise<RecruitingPage> =>
  fromSdk(() => recruitingControllerListRecruiting({ ...SESSION_REQUEST, query, signal }));

export const createRecruiting = (body: CreateRecruiting): Promise<RecruitingPost> =>
  fromSdk(() => recruitingControllerCreateRecruiting({ ...SESSION_REQUEST, body }));

export const closeRecruiting = async (id: string): Promise<void> => {
  await fromSdk(() => recruitingControllerCloseRecruiting({ ...SESSION_REQUEST, path: { id } }));
};
