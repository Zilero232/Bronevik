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

import { createComment } from '../../../../api/comments/comments';
import { CommentsThreadContext } from '../../../context';
import { useCommentForm } from '../use-comment-form';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

vi.mock('../../../../api/comments/comments', () => ({ listComments: vi.fn(), createComment: vi.fn(), removeComment: vi.fn() }));

const TEXT = messages.en.community.comments;
const THREAD: CommentThreadTarget = { target: 'guide', targetId: 'guide-1' };
const PARENT_ID = '00000000-0000-4000-8000-000000000001';
const THREAD_KEY = QUERY_KEYS.comments(THREAD);

const CREATED: Comment = {
  id: '00000000-0000-4000-8000-000000000002',
  target: THREAD.target,
  targetId: THREAD.targetId,
  parentId: PARENT_ID,
  body: 'Nice guide',
  author: { id: 'user-1', name: 'Tanker', image: null },
  createdAt: '2026-01-01T00:00:00.000Z'
};

const setup = () => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });

  client.setQueryData(THREAD_KEY, []);

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>
      <NextIntlClientProvider locale='en' messages={messages.en}>
        <CommentsThreadContext value={{ thread: THREAD, viewerId: 'user-1', isSignedIn: true }}>{children}</CommentsThreadContext>
      </NextIntlClientProvider>
    </QueryClientProvider>
  );

  return { client, wrapper };
};

describe('useCommentForm', () => {
  it('sends the trimmed body as a reply, clears the form and refreshes the thread', async () => {
    vi.mocked(createComment).mockResolvedValue(CREATED);
    const onDone = vi.fn<() => void>();
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useCommentForm({ parentId: PARENT_ID, onDone }), { wrapper });

    act(() => result.current.form.setValue('body', '  Nice guide  '));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(onDone).toHaveBeenCalledOnce());
    expect(vi.mocked(createComment).mock.calls[0]?.[0]).toEqual({ ...THREAD, parentId: PARENT_ID, body: 'Nice guide' });
    expect(result.current.form.getValues('body')).toBe('');
    expect(result.current.length).toBe(0);
    expect(client.getQueryState(THREAD_KEY)?.isInvalidated).toBe(true);
  });

  it('omits the parent for a top-level comment', async () => {
    vi.mocked(createComment).mockResolvedValue({ ...CREATED, parentId: null });
    const { wrapper } = setup();
    const { result } = renderHook(() => useCommentForm(), { wrapper });

    act(() => result.current.form.setValue('body', 'Nice guide'));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(createComment).toHaveBeenCalledOnce());
    expect(vi.mocked(createComment).mock.calls[0]?.[0]).not.toHaveProperty('parentId');
  });

  it('refuses a body made of whitespace without calling the server', async () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useCommentForm(), { wrapper });

    act(() => result.current.form.setValue('body', '   '));
    await act(() => result.current.onSubmit());

    expect(result.current.form.getFieldState('body').invalid).toBe(true);
    expect(createComment).not.toHaveBeenCalled();
  });

  it('keeps the draft and reports a failure when the server rejects the comment', async () => {
    vi.mocked(createComment).mockRejectedValue(new Error('down'));
    const onDone = vi.fn<() => void>();
    const { client, wrapper } = setup();
    const { result } = renderHook(() => useCommentForm({ onDone }), { wrapper });

    act(() => result.current.form.setValue('body', 'Nice guide'));
    await act(() => result.current.onSubmit());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith(TEXT.failed));
    expect(result.current.form.getValues('body')).toBe('Nice guide');
    expect(onDone).not.toHaveBeenCalled();
    expect(client.getQueryState(THREAD_KEY)?.isInvalidated).toBe(false);
  });

  it('counts the typed characters against the server limit', () => {
    const { wrapper } = setup();
    const { result } = renderHook(() => useCommentForm(), { wrapper });

    act(() => result.current.form.setValue('body', 'Nice'));

    expect(result.current.length).toBe('Nice'.length);
    expect(result.current.maxLength).toBeGreaterThan(result.current.length);
  });
});
