import { API_KEY, WEBHOOK } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { CODE_SAMPLES } from '../../../config/code-samples.constants';
import { quickstartSamples, webhookSamples } from '../code-samples';

const BASE = 'https://api.example.test';

describe('quickstartSamples', () => {
  const samples = quickstartSamples(`${BASE}/`);

  it('covers every quickstart language exactly once', () => {
    expect(samples.map(({ id }) => id)).toEqual([...CODE_SAMPLES.quickstart]);
  });

  it('points every sample at the configured base URL without a doubled slash', () => {
    samples.forEach(({ code }) => {
      expect(code).toContain(BASE);
      expect(code).not.toContain(`${BASE}//`);
    });
  });

  it('reads the key from the environment instead of inlining it', () => {
    samples.forEach(({ code }) => expect(code).toContain(CODE_SAMPLES.keyVariable));
    samples.filter(({ id }) => id !== 'ts').forEach(({ code }) => expect(code).toContain(API_KEY.header));
  });
});

describe('webhookSamples', () => {
  const samples = webhookSamples();

  it('covers every verification flavour exactly once', () => {
    expect(samples.map(({ id }) => id)).toEqual([...CODE_SAMPLES.webhook]);
  });

  it('points non-SDK samples at the standardwebhooks library', () => {
    samples.filter(({ id }) => id !== 'sdk').forEach(({ code }) => expect(code).toContain('standardwebhooks'));
  });

  it('passes every signed header the server sends to the verifier', () => {
    const node = samples.find(({ id }) => id === 'node')?.code ?? '';

    [WEBHOOK.deliveryHeader, WEBHOOK.timestampHeader, WEBHOOK.signatureHeader].forEach((name) => expect(node).toContain(name.toLowerCase()));
  });

  it('verifies through the SDK with the raw body and the request headers', () => {
    const sdk = samples.find(({ id }) => id === 'sdk')?.code ?? '';

    expect(sdk).toContain('verifyWebhook');
    expect(sdk).toContain(CODE_SAMPLES.secretVariable);
  });
});
