export const GAMEFACE = {
  globals: {
    model: 'model',
    engine: 'engine',
    viewEnv: 'viewEnv',
    subViews: 'subViews'
  },
  engine: {
    whenReady: 'whenReady',
    on: 'on',
    dataChangedEvent: 'viewEnv.onDataChanged'
  },
  viewEnv: {
    clientSize: 'getClientSizePx'
  },
  model: {
    state: 'state',
    send: 'send',
    nested: 'model'
  },
  button: {
    marker: 'otmetkiButton',
    markerValue: 'otmetki',
    open: 'open'
  },
  log: {
    noModel: '[OTMETKI] no Gameface model:',
    noButtonModel: '[OTMETKI] hangar button: no model to open the window'
  }
} as const;
