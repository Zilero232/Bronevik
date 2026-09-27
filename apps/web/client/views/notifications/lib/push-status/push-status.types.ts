export type PushStatus = 'denied' | 'idle' | 'loading' | 'subscribed' | 'unconfigured' | 'unsupported';

export type PushStatusInput = {
  isReady: boolean;
  isSupported: boolean;
  permission: NotificationPermission;
  publicKey: string | null | undefined;
  isSubscribed: boolean;
};
