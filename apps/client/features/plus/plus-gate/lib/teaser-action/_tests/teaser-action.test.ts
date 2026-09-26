import { describe, expect, it } from 'vitest';

import { teaserAction } from '../teaser-action';

describe('teaserAction', () => {
  it('asks a guest to sign in before anything else', () => {
    expect(teaserAction({ isSignedIn: false, isPlus: false, trialAvailable: true })).toBe('signIn');
  });

  it('offers the free trial while it is still available', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: false, trialAvailable: true })).toBe('trial');
  });

  it('sends a user who used the trial to the Plus page', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: false, trialAvailable: false })).toBe('subscribe');
  });

  it('shows no call to action to a subscriber', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: true, trialAvailable: false })).toBe('active');
  });
});
