export const WEBHOOK_FORM = {
  separator: /[\s,;]+/,
  errors: ['ids', 'filterEmpty', 'filterTooMany'],
  empty: { url: '', events: [], accountIds: '', clanIds: '' }
} as const;
