export const PUSH_SERVICE = {
  hosts: ['fcm.googleapis.com', 'android.googleapis.com', 'updates.push.services.mozilla.com', 'web.push.apple.com'],
  hostSuffixes: ['.push.services.mozilla.com', '.notify.windows.com', '.push.apple.com']
} as const;

export const INBOX = {
  defaultLimit: 20,
  maxLimit: 100
} as const;
