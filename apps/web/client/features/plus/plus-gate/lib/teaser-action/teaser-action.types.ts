export type TeaserActionInput = {
  isSignedIn: boolean;
  isPlus: boolean;
  trialAvailable: boolean;
  isCheckoutAvailable: boolean;
};

export type TeaserAction = 'active' | 'promo' | 'signIn' | 'subscribe' | 'trial';
