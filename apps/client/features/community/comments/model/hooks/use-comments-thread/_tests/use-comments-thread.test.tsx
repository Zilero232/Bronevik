import type { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterAll, describe, expect, it, vi } from 'vitest';

import type { AuthSession } from '@/entities/auth/session';

import { QUERY_KEYS } from '@/shared/constants';

import type { Comment } from '../../../../api';
import type { CommentThreadTarget } from '../../../../lib/comment-form';

import { listComments } from '../../../../api/comments/comments';
import { useCommentsThread } from '../use-comments-thread';

vi.hoisted(() => vi.resetModules());

afterAll(() => {
  vi.resetModules();
});

vi.mock('../../../../api/comments/comments', () => ({ listComments: vi.fn(), createComment: vi.fn(), removeComment: vi.fn() }));

const THREAD: CommentThreadTarget = { target: 'build', targetId: 'build-1' };
const SESSION: AuthSession = { user: { id: 'user-1', name: 'Tanker' }, lestaAccountId: null };

const ROOT: Comment = {
  id: '00000000-0000-4000-8000-000000000001',
  target: THREAD.target,
  targetId: THREAD.targetId,
  parentId: null,
  body: 'Solid build',
  author: { id: 'user-2', name: 'Gunner', image: null },
  createdAt: '2026-01-01T00:00:00.000Z'
};

const REPLY: Comment = { ...ROOT, id: '00000000-0000-4000-8000-000000000002', parentId: ROOT.id, body: 'Agreed' };
const OTHER_ROOT: Comment = { ...ROOT, id: '00000000-0000-4000-8000-000000000003', body: 'Too slow' };

const setup = (session: AuthSession) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  client.setQueryData(QUERY_KEYS.auth.session, session);

  const wrapper = ({ children }: { children: ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;

  return { client, wrapper };
};

describe('useCommentsThread', () => {
  it('groups replies under their root and counts every visible comment', async () => {
    vi.mocked(listComments).mockResolvedValue([ROOT, REPLY, OTHER_ROOT]);
    const { wrapper } = setup(SESSION);
    const { result } = renderHook(() => useCommentsThread(THREAD), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.nodes.map((node) => node.comment.id)).toEqual([ROOT.id, OTHER_ROOT.id]);
    expect(result.current.nodes[0]?.replies).toEqual([REPLY]);
    expect(result.current.count).toBe(3);
    expect(vi.mocked(listComments).mock.calls[0]?.[0]).toMatchObject(THREAD);
  });

  it('exposes the signed-in viewer', async () => {
    vi.mocked(listComments).mockResolvedValue([]);
    const { wrapper } = setup(SESSION);
    const { result } = renderHook(() => useCommentsThread(THREAD), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isSignedIn).toBe(true);
    expect(result.current.viewerId).toBe(SESSION?.user.id);
  });

  it('has no viewer for a guest', async () => {
    vi.mocked(listComments).mockResolvedValue([]);
    const { wrapper } = setup(null);
    const { result } = renderHook(() => useCommentsThread(THREAD), { wrapper });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.viewerId).toBeNull();
    expect(result.current.nodes).toEqual([]);
    expect(result.current.count).toBe(0);
  });

  it('reports an error when the first load fails and recovers on retry', async () => {
    vi.mocked(listComments).mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce([ROOT]);
    const { wrapper } = setup(null);
    const { result } = renderHook(() => useCommentsThread(THREAD), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.nodes).toEqual([]);

    act(() => result.current.retry());

    await waitFor(() => expect(result.current.count).toBe(1));
    expect(result.current.isError).toBe(false);
  });

  it('keeps showing loaded comments when a later refetch fails', async () => {
    vi.mocked(listComments).mockResolvedValueOnce([ROOT]).mockRejectedValueOnce(new Error('down'));
    const { client, wrapper } = setup(null);
    const { result } = renderHook(() => useCommentsThread(THREAD), { wrapper });

    await waitFor(() => expect(result.current.count).toBe(1));

    act(() => result.current.retry());

    await waitFor(() => expect(client.getQueryState(QUERY_KEYS.comments(THREAD))?.status).toBe('error'));
    expect(result.current.isError).toBe(false);
    expect(result.current.count).toBe(1);
  });
});
