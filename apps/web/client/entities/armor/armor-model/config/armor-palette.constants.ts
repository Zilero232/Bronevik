export const ARMOR_FACE_CLASSES = ['pen', 'chance', 'noPen', 'ricochet', 'spaced', 'module', 'hollow'] as const;

export const ARMOR_PALETTE = {
  pen: '#3fae5c',
  chance: '#e0b43a',
  noPen: '#d2452f',
  ricochet: '#8c2a1f',
  spaced: '#8467cf',
  module: '#5c7486',
  hollow: '#3a3f44'
} as const;

export const ARMOR_SHADING = {
  ambient: 0.5,
  diffuse: 0.5,
  neverRicochets: 1000
} as const;

export const ARMOR_MODEL_QUERY = {
  maxRetries: 2
} as const;
