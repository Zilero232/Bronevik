export const ARENA_FILES = {
  list: '_list_.xml',
  defaults: '_default_.xml'
} as const;

export const NON_BATTLE_ARENA = /^(?:qa_|tank_|te_|customization_|h\d+_|hangar)|test|_wt$|cosmic|_br_/i;

export const MINIMAP = {
  directory: 'maps',
  extension: '.webp',
  ddsPattern: /^spaces\/([^/]+)\/mmap(?:_(.+))?\.dds$/i
} as const;
