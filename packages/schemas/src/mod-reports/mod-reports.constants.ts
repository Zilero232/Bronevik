export const MOD_REPORTS = {
  managerVersionMaxLength: 32,
  modpackVersionMaxLength: 32,
  gameVersionMaxLength: 64,
  messageMaxLength: 2000,
  minFiles: 1,
  maxFiles: 6,
  fileNamePattern: /^[\w./-]{1,80}$/,
  maxFileTextBytes: 256 * 1024,
  maxTotalTextBytes: 384 * 1024,
  retentionDays: 30
} as const;
