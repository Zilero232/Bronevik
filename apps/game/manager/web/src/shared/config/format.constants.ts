export const DISPLAY_FORMAT = {
  bytesPerMegabyte: 1024 * 1024,
  bytesPerKilobyte: 1024,
  stamp: { dateStyle: 'medium', timeStyle: 'short' },
  megabytes: { style: 'unit', unit: 'megabyte', maximumFractionDigits: 1 },
  kilobytes: { style: 'unit', unit: 'kilobyte', maximumFractionDigits: 1 }
} as const;
