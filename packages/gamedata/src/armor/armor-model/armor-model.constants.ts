export const ARMOR_FLAGS = {
  spaced: 1,
  track: 2,
  gun: 4,
  module: 8,
  hollow: 16
} as const;

export const ARMOR_PIECE_KINDS = ['chassis', 'hull', 'turret', 'gun'] as const;
