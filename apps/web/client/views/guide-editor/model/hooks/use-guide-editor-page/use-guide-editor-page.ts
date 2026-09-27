'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { getGuide } from '@/entities/guide/guide';
import { isNotFoundError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { GUIDE_FORM } from '../../../config';

export const useGuideEditorPage = (slug: string | undefined) => {
  const { data: session, isPending: isSessionPending } = useAuthSession();
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: QUERY_KEYS.guides.detail({ viewerId: session?.user.id ?? null, slug: slug ?? '' }),
    queryFn: ({ signal }) => getGuide({ slug: slug ?? '', signal }),
    enabled: slug !== undefined && Boolean(session),
    retry: (failures, failure) => !isNotFoundError(failure) && failures < GUIDE_FORM.retries
  });

  const guide = slug === undefined ? null : (data ?? null);

  return {
    isEdit: slug !== undefined,
    isSessionPending,
    isSignedIn: Boolean(session),
    guide,
    isGuidePending: slug !== undefined && isPending,
    isNotFound: isNotFoundError(error),
    isError: error !== null && !data,
    isForeign: guide !== null && guide.author.id !== session?.user.id,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
