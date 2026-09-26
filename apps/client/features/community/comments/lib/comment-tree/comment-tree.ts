import type { Comment } from '../../api';

import type { CommentNode, RootIdOfInput } from './comment-tree.types';

export const isDeletedComment = (comment: Comment): boolean => comment.body === '';

const rootIdOf = ({ comment, byId }: RootIdOfInput): string => {
  const visited = new Set<string>();
  let current = comment;

  while (current.parentId !== null && !visited.has(current.id)) {
    visited.add(current.id);

    const parent = byId.get(current.parentId);

    if (!parent) {
      break;
    }

    current = parent;
  }

  return current.id;
};

export const buildCommentTree = (comments: readonly Comment[]): CommentNode[] => {
  const byId = new Map(comments.map((comment) => [comment.id, comment]));
  const nodes = new Map<string, CommentNode>();

  for (const comment of comments) {
    const rootId = rootIdOf({ comment, byId });

    if (rootId === comment.id) {
      nodes.set(comment.id, { comment, replies: nodes.get(comment.id)?.replies ?? [] });

      continue;
    }

    if (isDeletedComment(comment)) {
      continue;
    }

    const root = nodes.get(rootId);

    if (root) {
      root.replies.push(comment);
    } else {
      const rootComment = byId.get(rootId);

      if (rootComment) {
        nodes.set(rootId, { comment: rootComment, replies: [comment] });
      }
    }
  }

  const ordered = comments.flatMap((comment) => nodes.get(comment.id) ?? []);

  return ordered.filter((node) => !isDeletedComment(node.comment) || node.replies.length > 0);
};

export const countComments = (nodes: readonly CommentNode[]): number =>
  nodes.reduce((total, node) => total + node.replies.length + (isDeletedComment(node.comment) ? 0 : 1), 0);
