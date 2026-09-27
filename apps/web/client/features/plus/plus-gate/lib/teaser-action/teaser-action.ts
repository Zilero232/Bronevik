import type { TeaserAction, TeaserActionInput } from './teaser-action.types';

export const teaserAction = ({ isSignedIn, isPlus, trialAvailable, isCheckoutAvailable }: TeaserActionInput): TeaserAction => {
  if (!isSignedIn) {
    return 'signIn';
  }

  if (isPlus) {
    return 'active';
  }

  if (trialAvailable) {
    return 'trial';
  }

  return isCheckoutAvailable ? 'subscribe' : 'promo';
};
