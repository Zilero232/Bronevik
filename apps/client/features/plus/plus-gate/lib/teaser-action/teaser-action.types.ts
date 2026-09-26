export type TeaserActionInput = {
  isSignedIn: boolean;
  isPlus: boolean;
  trialAvailable: boolean;
};

export type TeaserAction = 'active' | 'signIn' | 'subscribe' | 'trial';
