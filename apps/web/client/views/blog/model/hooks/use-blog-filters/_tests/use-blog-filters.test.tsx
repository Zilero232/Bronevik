import { act, renderHook } from '@testing-library/react';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { describe, expect, it } from 'vitest';

import { BLOG_CATEGORIES } from '@/entities/blog/post';

import { useBlogFilters } from '../use-blog-filters';

const renderFilters = (searchParams: string) => renderHook(() => useBlogFilters(), { wrapper: withNuqsTestingAdapter({ searchParams }) });

const [CATEGORY] = BLOG_CATEGORIES;

describe('useBlogFilters', () => {
  it('shows every post by default and sends no filter', () => {
    const { result } = renderFilters('');

    expect(result.current).toMatchObject({ category: 'all', tag: null, isFiltered: false, params: {} });
  });

  it('ignores an unknown category from the URL', () => {
    const { result } = renderFilters('?category=gossip');

    expect(result.current.params).toEqual({});
  });

  it('sends the category and the tag from the URL', () => {
    const { result } = renderFilters(`?category=${CATEGORY}&tag=meta`);

    expect(result.current).toMatchObject({ isFiltered: true, params: { category: CATEGORY, tag: 'meta' } });
  });

  it('switches to the clicked tag and clears it on a second click', async () => {
    const { result } = renderFilters('?tag=meta');

    await act(async () => result.current.onTagsChange(['meta', 'patch']));

    expect(result.current.tag).toBe('patch');

    await act(async () => result.current.onTagsChange([]));

    expect(result.current.tag).toBeNull();
  });

  it('resets both filters', async () => {
    const { result } = renderFilters(`?category=${CATEGORY}&tag=meta`);

    await act(async () => result.current.onReset());

    expect(result.current).toMatchObject({ category: 'all', tag: null, isFiltered: false });
  });
});
