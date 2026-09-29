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
  // resizeViewPx(width, height) sizes a wulf view that would otherwise take the size of its content; a page whose
  // root is `100%` of a 0x0 view never shows. Both pages fit the view to the client. Lesta 1.45.0.0 live test
  // (python.log 2026-09-29): the HUD page, which called it, drew across the whole battle screen; the settings
  // page, which did not, loaded and stayed invisible.
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
