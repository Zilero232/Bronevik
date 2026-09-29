import { describe, expect, it } from 'vitest';

import { PREDICTIONS } from '../../../config';
import { canPredict, readIntegrationConfig } from '../integration-config';

describe('readIntegrationConfig', () => {
  it('reads the stored login and predictions flag', () => {
    expect(readIntegrationConfig({ login: 'jove', predictions: true })).toEqual({ login: 'jove', predictions: true });
  });

  it('returns an empty config for a missing or malformed value', () => {
    expect(readIntegrationConfig(null)).toEqual({});
    expect(readIntegrationConfig({ login: 42 })).toEqual({});
  });
});

describe('canPredict', () => {
  it('allows a Twitch integration granted the predictions scope', () => {
    expect(canPredict({ provider: 'twitch', scope: `chat:read ${PREDICTIONS.scope}` })).toBe(true);
  });

  it('refuses a Twitch integration without the scope', () => {
    expect(canPredict({ provider: 'twitch', scope: null })).toBe(false);
  });

  it('refuses another provider even with the scope', () => {
    expect(canPredict({ provider: 'donationAlerts', scope: PREDICTIONS.scope })).toBe(false);
  });
});
