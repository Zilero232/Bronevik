import type { TeaserAction, TeaserActionInput } from './teaser-action.types';

export const teaserAction = ({ isSignedIn, isPlus, trialAvailable }: TeaserActionInput): TeaserAction => {
  if (!isSignedIn) {
    return 'signIn';
  }

  if (isPlus) {
    return 'active';
  }

  return trialAvailable ? 'trial' : 'subscribe';
};
