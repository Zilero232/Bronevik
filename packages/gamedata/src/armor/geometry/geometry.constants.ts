export const ARMOR_GEOMETRY_FORMAT = {
  magic: [66, 82, 65, 77],
  version: 1,
  prefixBytes: 12,
  alignment: 4,
  quantizationSteps: 65_535,
  quantizationOffset: 32_768,
  maxShortIndex: 65_535
} as const;
