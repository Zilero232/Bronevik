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
  // UNVERIFIED on Lesta 1.45: resizeViewPx(width, height), which sizes a wulf view that would otherwise
  // take the size of its content (the HUD page's labels), so the page covers the whole client.
  viewEnv: {
    clientSize: 'getClientSizePx',
    resizeView: 'resizeViewPx'
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
