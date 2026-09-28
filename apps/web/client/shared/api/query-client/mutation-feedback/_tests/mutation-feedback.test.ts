import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { messages } from '@/shared/i18n';

import type { MutationFeedbackMeta } from '..';

import { createMutationCache } from '..';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const run = ({ meta, mutationFn }: { meta?: MutationFeedbackMeta; mutationFn: () => Promise<unknown> }) => {
  const client = new QueryClient({ mutationCache: createMutationCache() });
  const invalidate = vi.spyOn(client, 'invalidateQueries');
  const execution = client.getMutationCache().build(client, { mutationFn, meta }).execute(undefined);

  return { execution, invalidate };
};

beforeEach(() => {
  document.documentElement.lang = 'en';
});

afterEach(() => {
  document.documentElement.lang = '';
});

describe('createMutationCache', () => {
  it('toasts the success key in the page locale and invalidates every listed query', async () => {
    const { execution, invalidate } = run({
      mutationFn: async () => 'ok',
      meta: {
        successKey: 'me.toast.goalAdded',
        invalidates: [
          ['me', 'goals'],
          ['me', 'overview']
        ]
      }
    });

    await execution;

    expect(toast.success).toHaveBeenCalledWith(messages.en.me.toast.goalAdded);
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['me', 'goals'] });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['me', 'overview'] });
  });

  it('falls back to the default locale when the page has no known language', async () => {
    document.documentElement.lang = 'de';

    await run({ mutationFn: async () => 'ok', meta: { successKey: 'me.toast.goalAdded' } }).execution;

    expect(toast.success).toHaveBeenCalledWith(messages.ru.me.toast.goalAdded);
  });

  it('toasts a static error key', async () => {
    await expect(run({ mutationFn: () => Promise.reject(new Error('boom')), meta: { errorKey: 'me.toast.failed' } }).execution).rejects.toThrow(
      'boom'
    );

    expect(toast.error).toHaveBeenCalledWith(messages.en.me.toast.failed);
  });

  it('resolves an error key from the error', async () => {
    const errorKey = vi.fn((): 'developer.toast.failed' => 'developer.toast.failed');
    const failure = new Error('boom');

    await expect(run({ mutationFn: () => Promise.reject(failure), meta: { errorKey } }).execution).rejects.toBe(failure);

    expect(errorKey).toHaveBeenCalledWith(failure);
    expect(toast.error).toHaveBeenCalledWith(messages.en.developer.toast.failed);
  });

  it('stays silent for a mutation without meta', async () => {
    const { execution, invalidate } = run({ mutationFn: () => Promise.reject(new Error('boom')) });

    await expect(execution).rejects.toThrow('boom');

    expect(toast.success).not.toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(invalidate).not.toHaveBeenCalled();
  });
});
