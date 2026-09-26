import { TELEGRAM_WEB_LOGIN } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { webLoginCodeState, webLoginPhase } from '../web-login';

const codeOf = (length: number) => 'a'.repeat(length);

describe('webLoginCodeState', () => {
  it('reports a missing code when the link has no parameter', () => {
    expect(webLoginCodeState(null)).toBe('missing');
  });

  it('treats an empty parameter as missing, not invalid', () => {
    expect(webLoginCodeState('')).toBe('missing');
  });

  it('accepts a code exactly at the minimum length', () => {
    expect(webLoginCodeState(codeOf(TELEGRAM_WEB_LOGIN.minCodeLength))).toBe('valid');
  });

  it('rejects a code one character short of the minimum', () => {
    expect(webLoginCodeState(codeOf(TELEGRAM_WEB_LOGIN.minCodeLength - 1))).toBe('invalid');
  });

  it('accepts a code exactly at the maximum length', () => {
    expect(webLoginCodeState(codeOf(TELEGRAM_WEB_LOGIN.maxCodeLength))).toBe('valid');
  });

  it('rejects a code past the maximum length', () => {
    expect(webLoginCodeState(codeOf(TELEGRAM_WEB_LOGIN.maxCodeLength + 1))).toBe('invalid');
  });
});

describe('webLoginPhase', () => {
  it('never reports redeeming for a code that was not sent', () => {
    expect(webLoginPhase({ codeState: 'missing', status: 'idle' })).toBe('missing');
    expect(webLoginPhase({ codeState: 'invalid', status: 'idle' })).toBe('invalid');
  });

  it('shows the redeeming state before the request starts, so a valid link never flashes an error', () => {
    expect(webLoginPhase({ codeState: 'valid', status: 'idle' })).toBe('redeeming');
    expect(webLoginPhase({ codeState: 'valid', status: 'pending' })).toBe('redeeming');
  });

  it('maps a rejected code to the failed state', () => {
    expect(webLoginPhase({ codeState: 'valid', status: 'error' })).toBe('failed');
  });

  it('maps a redeemed code to success', () => {
    expect(webLoginPhase({ codeState: 'valid', status: 'success' })).toBe('success');
  });
});
