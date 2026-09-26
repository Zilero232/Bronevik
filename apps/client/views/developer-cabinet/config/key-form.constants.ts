export const KEY_EXPIRY = {
  options: ['never', '30', '90', '365'],
  initial: 'never'
} as const;

export const CREATE_KEY_FORM_DEFAULT_VALUES = {
  name: '',
  expiry: KEY_EXPIRY.initial
} as const;
