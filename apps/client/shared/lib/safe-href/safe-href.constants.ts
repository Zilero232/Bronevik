export const SAFE_HREF = {
  protocols: ['http:', 'https:', 'mailto:'],
  webProtocols: ['http:', 'https:'],
  scheme: /^([a-z][\d+.a-z-]*):/i,
  protocolRelative: /^[/\\]{2}/,
  printableFrom: 33,
  deleteChar: 127
} as const;
