import { describe, expect, it } from 'vitest';

import { COMMENT_MAX_LENGTH } from '../../../config';
import { toCreateComment } from '../comment-form';
import { commentFormSchema } from '../comment-form.schemas';

describe('commentFormSchema', () => {
  it('trims the body before checking it', () => {
    expect(commentFormSchema.parse({ body: '  gg wp  ' })).toEqual({ body: 'gg wp' });
  });

  it('rejects a whitespace-only body', () => {
    expect(commentFormSchema.safeParse({ body: '   ' }).success).toBe(false);
  });

  it('rejects a body over the server limit', () => {
    expect(commentFormSchema.safeParse({ body: 'x'.repeat((COMMENT_MAX_LENGTH ?? 0) + 1) }).success).toBe(false);
  });
});

describe('toCreateComment', () => {
  it('omits parentId for a top-level comment', () => {
    expect(toCreateComment({ values: { body: 'hi' }, target: 'guide', targetId: 'g1' })).not.toHaveProperty('parentId');
  });

  it('sends parentId for a reply', () => {
    expect(toCreateComment({ values: { body: 'hi' }, target: 'replay', targetId: 'r1', parentId: 'c1' }).parentId).toBe('c1');
  });
});
