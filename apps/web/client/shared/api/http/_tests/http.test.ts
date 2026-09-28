// @vitest-environment node
import type { AxiosAdapter } from 'axios';

import { INTERNAL_REQUEST } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { api } from '../http';

const echoHeaders: AxiosAdapter = async (config) => ({ data: config.headers.toJSON(), status: 200, statusText: 'OK', headers: {}, config });

describe('api on the Next server', () => {
  it('signs every server-side request with the internal token', async () => {
    const { data } = await api.get('/players/x', { adapter: echoHeaders });

    expect(data).toMatchObject({ [INTERNAL_REQUEST.tokenHeader]: process.env.INTERNAL_API_TOKEN });
  });
});
