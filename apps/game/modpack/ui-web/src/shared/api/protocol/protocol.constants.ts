export const PROTOCOL = {
  version: 1,
  commands: [
    'ready',
    'close',
    'set',
    'action',
    'language',
    'bind',
    'open',
    'profile_save',
    'profile_load',
    'profile_rename',
    'profile_delete',
    'profile_export',
    'profile_import',
    'hud_edit',
    'hud_move',
    'hud_reset'
  ],
  groups: ['data', 'hangar', 'battle'],
  alignX: ['left', 'center', 'right'],
  alignY: ['top', 'center', 'bottom'],
  noticeKinds: ['info', 'error', 'code'],
  figureTones: ['pen', 'crit', 'blocked', 'ricochet', 'nodamage'],
  autoLanguage: 'auto'
} as const;
