import { API_KEY, WEBHOOK } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { quickstartSamples, webhookSamples } from '../code-samples';
import { CODE_SAMPLES } from '../code-samples.constants';

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

  it('checks the documented signature scheme by hand', () => {
    samples.filter(({ id }) => id !== 'sdk').forEach(({ code }) => expect(code).toContain(`${WEBHOOK.signatureScheme}=`));
  });

  it('reads the signature and timestamp headers the server sends', () => {
    const sdk = samples.find(({ id }) => id === 'sdk')?.code ?? '';

    expect(sdk).toContain(WEBHOOK.signatureHeader.toLowerCase());
    expect(sdk).toContain(WEBHOOK.timestampHeader.toLowerCase());
  });
});
