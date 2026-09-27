import { request as httpRequest } from 'node:http';
import { request as httpsRequest } from 'node:https';

import type { PostWebhookInput, ReadLimitedInput, WebhookResponse } from './webhook-post.types';

export class WebhookResponseError extends Error {
  constructor(readonly response: WebhookResponse) {
    super(`The webhook endpoint answered ${response.status}`);
  }
}

const readLimited = async ({ response, maxBodyBytes }: ReadLimitedInput): Promise<string> => {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of response) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));

    chunks.push(buffer.subarray(0, Math.max(0, maxBodyBytes - size)));
    size += buffer.length;

    if (size >= maxBodyBytes) {
      response.destroy();

      break;
    }
  }

  return Buffer.concat(chunks).toString('utf8');
};

export const postWebhook = ({ url, body, headers, address, timeoutMs, maxBodyBytes }: PostWebhookInput): Promise<WebhookResponse> =>
  new Promise((resolve, reject) => {
    const target = new URL(url);
    const send = target.protocol === 'https:' ? httpsRequest : httpRequest;

    const outgoing = send(
      {
        protocol: target.protocol,
        host: address,
        port: target.port || undefined,
        path: `${target.pathname}${target.search}`,
        servername: target.hostname,
        method: 'POST',
        headers: { ...headers, host: target.host, 'content-length': String(Buffer.byteLength(body)) },
        agent: false,
        timeout: timeoutMs,
        signal: AbortSignal.timeout(timeoutMs)
      },
      (response) => {
        readLimited({ response, maxBodyBytes })
          .then((text) => {
            const result = { status: response.statusCode ?? 0, body: text };

            if (result.status >= 200 && result.status < 300) {
              resolve(result);
            } else {
              reject(new WebhookResponseError(result));
            }
          })
          .catch(reject);
      }
    );

    outgoing.on('timeout', () => outgoing.destroy(new Error(`The webhook endpoint did not answer in ${timeoutMs} ms`)));
    outgoing.on('error', reject);
    outgoing.end(body);
  });
