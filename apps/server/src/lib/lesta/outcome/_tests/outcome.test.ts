import { describe, expect, it } from 'vitest';

import { LESTA_ERROR_CODE } from '../../errors';
import { classifyLestaResponse } from '../outcome';

const errorBody = (message: string) => JSON.stringify({ status: 'error', error: { code: 407, message } });

describe('classifyLestaResponse', () => {
  it('treats a normal envelope as ok', () => {
    expect(classifyLestaResponse({ status: 200, body: JSON.stringify({ status: 'ok', data: {} }) })).toBe('ok');
  });

  it('flags the rate limit and source outages as degraded', () => {
    expect(classifyLestaResponse({ status: 200, body: errorBody(LESTA_ERROR_CODE.requestLimitExceeded) })).toBe('degraded');
    expect(classifyLestaResponse({ status: 200, body: errorBody(LESTA_ERROR_CODE.sourceNotAvailable) })).toBe('degraded');
    expect(classifyLestaResponse({ status: 503, body: '' })).toBe('degraded');
  });

  it('keeps our own mistakes out of the degradation signal', () => {
    expect(classifyLestaResponse({ status: 200, body: errorBody(LESTA_ERROR_CODE.accountIdListLimitExceeded) })).toBe('rejected');
    expect(classifyLestaResponse({ status: 404, body: '' })).toBe('rejected');
  });
});
