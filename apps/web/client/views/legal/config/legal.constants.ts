export const LEGAL_DOCS = ['privacy', 'terms', 'contacts'] as const;

export const LEGAL_SECTIONS = {
  privacy: ['operator', 'data', 'purposes', 'basis', 'storage', 'transfer', 'rights', 'cookies', 'privacyChanges'],
  terms: ['parties', 'subject', 'account', 'plus', 'payment', 'refund', 'rules', 'liability', 'termsChanges'],
  contacts: ['requisites', 'support', 'dataErrors', 'game']
} as const;
