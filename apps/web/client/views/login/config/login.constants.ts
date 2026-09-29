export const LOGIN = {
  telegramScript: 'https://telegram.org/js/telegram-widget.js?22',
  telegramCallback: 'onOtmetkiTelegramAuth',
  errorParam: 'authError',
  errors: [
    'lesta_state',
    'lesta_denied',
    'lesta_token',
    'lesta_unavailable',
    'lesta_account_taken',
    'lesta_link_limit',
    'lesta_not_connected'
  ] as const
} as const;
