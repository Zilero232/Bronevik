'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuthSession } from '@/entities/auth/session';
import { QUERY_KEYS } from '@/shared/constants';

import type { CommentThreadTarget } from '../../../lib/comment-form';
import type { CommentsThreadContextValue } from '../../context';

import { listComments } from '../../../api';
import { buildCommentTree, countComments } from '../../../lib/comment-tree';

export const useCommentsThread = ({ target, targetId }: CommentThreadTarget) => {
  const { data: session } = useAuthSession();
  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: QUERY_KEYS.comments({ target, targetId }),
    queryFn: ({ signal }) => listComments({ target, targetId, signal })
  });

  const nodes = buildCommentTree(data ?? []);
  const context: CommentsThreadContextValue = { thread: { target, targetId }, viewerId: session?.user.id ?? null, isSignedIn: Boolean(session) };

  return {
    context,
    nodes,
    count: countComments(nodes),
    isPending,
    isError: isError && !data,
    isRetrying: isFetching,
    retry: () => void refetch()
  };
};
