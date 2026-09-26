'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { listComments } from '@/shared/api/comments';
import { QUERY_KEYS } from '@/shared/constants';

import type { CommentThreadTarget } from '../../../lib/comment-form';

import { buildCommentTree, countComments } from '../../../lib/comment-tree';

export const useCommentsThread = ({ target, targetId }: CommentThreadTarget) => {
  const { data: session } = useAuthSession();
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.comments({ target, targetId }),
    queryFn: ({ signal }) => listComments({ target, targetId, signal })
  });

  const nodes = buildCommentTree(data ?? []);

  return {
    nodes,
    count: countComments(nodes),
    viewerId: session?.user.id ?? null,
    isSignedIn: Boolean(session),
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
