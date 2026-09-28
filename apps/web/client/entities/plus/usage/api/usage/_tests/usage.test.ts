import { describe, expect, it, vi } from 'vitest';

import { api } from '@/shared/api/http';

import { getUsage } from '../usage';

describe('getUsage', () => {
  it('sends cookies so the API can keep the anonymous device cookie across visits', async () => {
    const get = vi.spyOn(api, 'get').mockRejectedValue(new Error('stop'));

    await expect(getUsage()).rejects.toThrow('stop');
    expect(get).toHaveBeenCalledWith('/me/usage', expect.objectContaining({ withCredentials: true }));
  });
});
