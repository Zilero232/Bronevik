export const WEBHOOK_FORM = {
  separator: /[\s,;]+/,
  errors: ['ids', 'filterEmpty', 'filterTooMany'],
  idFields: ['accountIds', 'clanIds'],
  empty: { url: '', events: [], accountIds: '', clanIds: '' },
  urlPlaceholder: 'https://'
} as const;
