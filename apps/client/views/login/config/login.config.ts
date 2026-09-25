export const LOGIN = {
  telegramScript: 'https://telegram.org/js/telegram-widget.js?22',
  telegramCallback: 'onBronevikTelegramAuth',
  perks: ['favorites', 'goals', 'mod', 'alerts'] as const,
  errors: ['lesta_state', 'lesta_denied', 'lesta_token', 'lesta_unavailable', 'lesta_account_taken'] as const
} as const;
