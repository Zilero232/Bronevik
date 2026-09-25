export const WEBHOOK_URL = {
  blockedHosts: [/^localhost$/i, /\.localhost$/i, /\.local$/i, /\.internal$/i],
  blockedIpv4: [/^127\./, /^10\./, /^192\.168\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^0\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./],
  blockedIpv6: [/^::1?$/, /^f[cd]/i, /^fe80:/i, /^::ffff:/i]
} as const;
