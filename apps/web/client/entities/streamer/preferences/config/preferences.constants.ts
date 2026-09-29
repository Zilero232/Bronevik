import { STREAMER_SETTINGS } from '@otmetki/schemas';

export const PREFERENCES_FILE = {
  path: '%APPDATA%\Lesta\MirTankov\preferences.xml',
  name: 'preferences.xml',
  accept: '.xml,application/xml,text/xml',
  maxBytes: 5_000_000
} as const;

export const PREFERENCES_TAGS = {
  blocked: ['loginPage', 'login', 'account', 'accounts', 'auth', 'token', 'password', 'email', 'session'],
  resolution: [
    { width: 'devicePreferences fullscreenWidth', height: 'devicePreferences fullscreenHeight' },
    { width: 'devicePreferences windowedWidth', height: 'devicePreferences windowedHeight' },
    { width: 'fullscreenWidth', height: 'fullscreenHeight' },
    { width: 'windowedWidth', height: 'windowedHeight' }
  ],
  fields: [
    { path: 'display.refreshRate', kind: 'integer', selectors: ['devicePreferences fullscreenRefresh', 'fullscreenRefresh', 'refreshRate'] },
    {
      path: 'display.windowMode',
      kind: 'index',
      selectors: ['devicePreferences windowMode', 'windowMode'],
      options: ['windowed', 'fullscreen', 'borderless']
    },
    { path: 'display.vsync', kind: 'boolean', selectors: ['devicePreferences waitVSync', 'waitVSync', 'vertSync', 'vsync'] },
    { path: 'display.tripleBuffering', kind: 'boolean', selectors: ['devicePreferences tripleBuffering', 'tripleBuffering', 'triplebuffering'] },
    {
      path: 'display.preset',
      kind: 'index',
      selectors: ['graphicsPreferences graphicsPreset', 'graphicsPreset'],
      options: STREAMER_SETTINGS.presets
    },
    { path: 'display.fpsCap', kind: 'integer', selectors: ['devicePreferences fpsLimit', 'fpsLimit'] },
    { path: 'camera.fov', kind: 'integer', selectors: ['fov'] },
    { path: 'camera.postMortem', kind: 'boolean', selectors: ['enablePostMortemEffect'] },
    { path: 'camera.sniperDynamicCamera', kind: 'boolean', selectors: ['dynamicCameraEnabled'] },
    { path: 'camera.horizontalStabilisation', kind: 'boolean', selectors: ['horStabilizationSnp'] },
    {
      path: 'controls.sensitivity.arcade',
      kind: 'decimal',
      selectors: ['controlMode arcadeMode camera sensitivity', 'arcadeMode camera sensitivity']
    },
    {
      path: 'controls.sensitivity.sniper',
      kind: 'decimal',
      selectors: ['controlMode sniperMode camera sensitivity', 'sniperMode camera sensitivity']
    },
    {
      path: 'controls.sensitivity.artillery',
      kind: 'decimal',
      selectors: ['controlMode strategicMode camera sensitivity', 'strategicMode camera sensitivity']
    },
    { path: 'controls.invert', kind: 'boolean', selectors: ['invertVertical', 'mouseInvertVert'] }
  ]
} as const;

export const PREFERENCES_BLOCKED_TAGS: ReadonlySet<string> = new Set(PREFERENCES_TAGS.blocked.map((tag) => tag.toLowerCase()));

export const PREFERENCES_VALUES = {
  number: /^-?\d{1,6}(\.\d{1,8})?$/u,
  truthy: ['true', '1'],
  falsy: ['false', '0'],
  maxTextLength: 32,
  decimalDigits: 2
} as const;
