import { describe, expect, it } from 'vitest';

import type { Comment } from '../../../api';

import { buildCommentTree, countComments } from '../comment-tree';

const AUTHOR = { id: '00000000-0000-4000-8000-000000000001', name: 'Tanker', image: null };

const comment = (id: string, parentId: string | null = null, body = `text ${id}`): Comment => ({
  id,
  target: 'guide',
  targetId: 'guide-1',
  parentId,
  body,
  author: AUTHOR,
  createdAt: '2026-09-26T10:00:00.000Z'
});

describe('buildCommentTree', () => {
  it('keeps top-level comments in server order with their replies', () => {
    const tree = buildCommentTree([comment('a'), comment('b'), comment('a1', 'a'), comment('b1', 'b'), comment('a2', 'a')]);

    expect(tree.map((node) => node.comment.id)).toEqual(['a', 'b']);
    expect(tree[0]?.replies.map((reply) => reply.id)).toEqual(['a1', 'a2']);
    expect(tree[1]?.replies.map((reply) => reply.id)).toEqual(['b1']);
  });

  it('flattens a reply to a reply under the top-level comment', () => {
    const tree = buildCommentTree([comment('a'), comment('a1', 'a'), comment('a1x', 'a1')]);

    expect(tree).toHaveLength(1);
    expect(tree[0]?.replies.map((reply) => reply.id)).toEqual(['a1', 'a1x']);
  });

  it('shows a reply whose parent is missing as a top-level comment', () => {
    const tree = buildCommentTree([comment('orphan', 'gone')]);

    expect(tree.map((node) => node.comment.id)).toEqual(['orphan']);
  });

  it('drops a deleted comment without replies but keeps one that still has replies', () => {
    const tree = buildCommentTree([comment('a', null, ''), comment('b', null, ''), comment('b1', 'b')]);

    expect(tree.map((node) => node.comment.id)).toEqual(['b']);
  });

  it('drops deleted replies', () => {
    const tree = buildCommentTree([comment('a'), comment('a1', 'a', '')]);

    expect(tree[0]?.replies).toEqual([]);
  });

  it('returns an empty tree for an empty thread', () => {
    expect(buildCommentTree([])).toEqual([]);
  });
});

describe('countComments', () => {
  it('counts visible comments and replies but not deleted placeholders', () => {
    const tree = buildCommentTree([comment('a'), comment('a1', 'a'), comment('b', null, ''), comment('b1', 'b')]);

    expect(countComments(tree)).toBe(3);
  });
});
