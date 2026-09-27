import { describe, expect, it } from 'vitest';

import { teaserAction } from '../teaser-action';

describe('teaserAction', () => {
  it('asks a guest to sign in before anything else', () => {
    expect(teaserAction({ isSignedIn: false, isPlus: false, trialAvailable: true, isCheckoutAvailable: false })).toBe('signIn');
  });

  it('offers the free trial while it is still available', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: false, trialAvailable: true, isCheckoutAvailable: false })).toBe('trial');
  });

  it('sends a user who used the trial to the Plus page', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: false, trialAvailable: false, isCheckoutAvailable: true })).toBe('subscribe');
  });

  it('offers a promo code instead of a dead end while payments are closed', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: false, trialAvailable: false, isCheckoutAvailable: false })).toBe('promo');
  });

  it('shows no call to action to a subscriber', () => {
    expect(teaserAction({ isSignedIn: true, isPlus: true, trialAvailable: false, isCheckoutAvailable: false })).toBe('active');
  });
});
