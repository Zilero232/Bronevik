import pRetry from 'p-retry';
import { isNonNullish, pickBy } from 'remeda';

import type { LestaEnvelope } from '../schemas';
import type { LestaClientOptions, LestaRequester, LestaRequestInput, LestaResponse, ReadEnvelopeInput, SendInput } from './client.types';

import { isRetryableLestaError, LESTA_ERROR_CODE, LestaApiError, LestaHttpError, LestaNetworkError } from '../errors';
import { noopRateLimiter } from '../rate-limit';
import { lestaEnvelopeSchema } from '../schemas';
import { LESTA_API, LESTA_RETRY } from './client.constants';
import { toSearchParams } from './params';

const normalizeBaseUrl = (baseUrl: string): string => (baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`);

const normalizeMethod = (method: string): string => {
  const trimmed = method.replace(/^\/+|\/+$/g, '');

  return `${trimmed}/`;
};

const safeJson = (text: string): unknown => {
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
};

const readEnvelope = async ({ response, method }: ReadEnvelopeInput): Promise<LestaEnvelope> => {
  const text = await response.text();

  if (!response.ok) {
    throw new LestaHttpError({ method, status: response.status, body: text });
  }

  const parsed = lestaEnvelopeSchema.safeParse(safeJson(text));

  if (!parsed.success) {
    throw new LestaApiError({ code: LESTA_ERROR_CODE.invalidResponse, message: parsed.error.message, method });
  }

  return parsed.data;
};

export const createRequester = ({
  applicationId,
  baseUrl = LESTA_API.baseUrl,
  language = LESTA_API.language,
  accessToken,
  rateLimiter = noopRateLimiter,
  retry,
  timeoutMs = LESTA_API.timeoutMs,
  fetch: fetchImpl = globalThis.fetch
}: LestaClientOptions): LestaRequester => {
  const root = normalizeBaseUrl(baseUrl);
  const retryOptions = { ...LESTA_RETRY, ...retry };

  const send = async ({ method, params = {} }: SendInput): Promise<LestaEnvelope> => {
    const body = toSearchParams({ application_id: applicationId, language, access_token: accessToken, ...pickBy(params, isNonNullish) });

    await rateLimiter.acquire();

    let response: Response;

    try {
      response = await fetchImpl(`${root}${normalizeMethod(method)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: body.toString(),
        signal: AbortSignal.timeout(timeoutMs)
      });
    } catch (error) {
      throw new LestaNetworkError({ method, cause: error });
    }

    return readEnvelope({ response, method });
  };

  const sendChecked = async (input: SendInput) => {
    const envelope = await send(input);

    if (envelope.status === 'error') {
      const { code, message, field, value } = envelope.error;

      throw new LestaApiError({
        code: message,
        method: input.method,
        status: code,
        field,
        value: value === undefined || value === null ? value : String(value)
      });
    }

    return envelope;
  };

  const call = async <T>({ method, params, schema }: LestaRequestInput<T>): Promise<LestaResponse<T>> => {
    const envelope = await pRetry(() => sendChecked({ method, params }), {
      ...retryOptions,
      shouldRetry: ({ error }) => isRetryableLestaError(error)
    });

    const parsed = schema.safeParse(envelope.data);

    if (!parsed.success) {
      throw new LestaApiError({ code: LESTA_ERROR_CODE.invalidResponse, message: parsed.error.message, method });
    }

    return { data: parsed.data, meta: envelope.meta ?? {} };
  };

  return { call, applicationId, baseUrl: root };
};
