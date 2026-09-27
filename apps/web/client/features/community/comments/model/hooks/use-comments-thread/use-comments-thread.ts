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
  const query = useQuery({
    queryKey: QUERY_KEYS.comments({ target, targetId }),
    queryFn: ({ signal }) => listComments({ target, targetId, signal }),
    select: buildCommentTree
  });

  const context: CommentsThreadContextValue = { thread: { target, targetId }, viewerId: session?.user.id ?? null, isSignedIn: Boolean(session) };

  return {
    context,
    query,
    count: countComments(query.data ?? [])
  };
};
