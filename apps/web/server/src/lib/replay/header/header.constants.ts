export const JSON_FIXUPS = {
  bigIntegerKeys: /"(arenaUniqueID)"\s*:\s*(\d{16,})/g,
  nonFiniteNumbers: /(?<=[:,[]\s*)-?(?:NaN|Infinity)(?=\s*[,\]}])/g
} as const;
