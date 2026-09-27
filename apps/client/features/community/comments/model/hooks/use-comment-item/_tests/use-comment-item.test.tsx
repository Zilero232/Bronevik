import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { toast } from 'sonner';
import { afterAll, describe, expect, it, vi } from 'vitest';

import { QUERY_KEYS } from '@/shared/constants';
import { messages } from '@/shared/i18n';

import type { Comment } from '../../../../api';
import type { CommentThreadTarget } from '../../../../lib/comment-form';
import type { CommentsThreadContextValue } from '../../../context';
import type { UseCommentItemInput } from '../use-comment-item.types';

import { removeComment } from '../../../../api/comments/comments';
import { CommentsThreadContext } from '../../../context';
import { useCommentItem } from '../use-comment-item';

type RenderItemInput = Partial<UseCommentItemInput & CommentsThreadContextValue>;

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api/comments/comments', () => ({ listComments: vi.fn(), createComment: vi.fn(), removeComment: vi.fn() }));

const TEXT = messages.en.community.comments;
const THREAD: CommentThreadTarget = { target: 'replay', targetId: 'replay-1' };
const THREAD_KEY = QUERY_KEYS.comments(THREAD);
const AUTHOR_ID = 'user-1';

const COMMENT: Comment = {
  id: '00000000-0000-4000-8000-000000000001',
  target: THREAD.target,
  targetId: THREAD.targetId,
  parentId: null,
  body: 'Good push',
  author: { id: AUTHOR_ID, name: 'Tanker', image: null },
  createdAt: '2026-01-01T00:00:00.000Z'
};

const setup = (viewer: Partial<CommentsThreadContextValue>) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(THREAD_KEY, [COMMENT]);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        <CommentsThreadContext value={{ thread: THREAD, viewerId: AUTHOR_ID, isSignedIn: true, ...viewer }}>{children}</CommentsThreadContext>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, wrapper };
};

const renderItem = ({ comment = COMMENT, isReply, ...viewer }: RenderItemInput = {}) => {
  const { client, wrapper } = setup(viewer);
  const view = renderHook(() => useCommentItem({ comment, isReply }), { wrapper });

  return { client, ...view };
};

describe('useCommentItem', () => {
  it('treats the comment as own only for its signed-in author', () => {
    expect(renderItem().result.current.isOwn).toBe(true);
    expect(renderItem({ viewerId: 'user-2' }).result.current.isOwn).toBe(false);
    expect(renderItem({ viewerId: null }).result.current.isOwn).toBe(false);
  });

  it('lets a signed-in viewer reply only to a top-level comment', () => {
    expect(renderItem().result.current.canReply).toBe(true);
    expect(renderItem({ isReply: true }).result.current.canReply).toBe(false);
    expect(renderItem({ isSignedIn: false, viewerId: null }).result.current.canReply).toBe(false);
  });

  it('marks a comment with an empty body as deleted', () => {
    expect(renderItem().result.current.isDeleted).toBe(false);
    expect(renderItem({ comment: { ...COMMENT, body: '' } }).result.current.isDeleted).toBe(true);
  });

  it('opens the reply box on toggle and closes it explicitly', () => {
    const { result } = renderItem();

    expect(result.current.isReplying).toBe(false);

    act(() => result.current.toggleReply());
    expect(result.current.isReplying).toBe(true);

    act(() => result.current.closeReply());
    expect(result.current.isReplying).toBe(false);

    act(() => result.current.closeReply());
    expect(result.current.isReplying).toBe(false);
  });

  it('removes the comment by its id, confirms it and refreshes the thread', async () => {
    vi.mocked(removeComment).mockResolvedValue();
    const { client, result } = renderItem();

    act(() => result.current.remove());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith(TEXT.removed));
    expect(removeComment).toHaveBeenCalledWith(COMMENT.id);
    expect(client.getQueryState(THREAD_KEY)?.isInvalidated).toBe(true);
  });

  it('reports a failed removal and leaves the thread cached', async () => {
    vi.mocked(removeComment).mockRejectedValue(new Error('down'));
    const { client, result } = renderItem();

    act(() => result.current.remove());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(toast.success).not.toHaveBeenCalled();
    expect(client.getQueryState(THREAD_KEY)?.isInvalidated).toBe(false);
    expect(result.current.isRemoving).toBe(false);
  });
});
