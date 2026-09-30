export const GAMEFACE = {
  globals: {
    model: 'model',
    engine: 'engine',
    viewEnv: 'viewEnv',
    subViews: 'subViews',
    resources: 'R'
  },
  engine: {
    whenReady: 'whenReady',
    on: 'on',
    call: 'call',
    dataChangedEvent: 'viewEnv.onDataChanged'
  },
  // RU 1.45 client bundles and OpenWG's libs/model.js register the model with addDataChangedCallback('model', 0, true)
  // and only react when its id is among the event's callbackIDs; subViews is native (ids(), get(resId).model).
  dataChanged: {
    register: 'addDataChangedCallback',
    path: 'model',
    rootId: 0,
    trackSubItems: true
  },
  subViews: {
    ids: 'ids',
    get: 'get'
  },
  // resizeViewPx(width, height) sizes a wulf view that would otherwise take the size of its content; a page whose
  // root is `100%` of a 0x0 view never shows. Both pages fit the view to the client. Lesta 1.45.0.0 live test
  // (python.log 2026-09-29): the HUD page, which called it, drew across the whole battle screen; the settings
  // page, which did not, loaded and stayed invisible.
  viewEnv: {
    clientSize: 'getClientSizePx',
    clientSizeRem: 'getClientSizeRem',
    viewPosition: 'getViewGlobalPositionRem',
    viewSize: 'getViewSizeRem',
    remToPx: 'remToPx',
    resizeView: 'resizeViewPx',
    inputArea: 'setInputArea',
    mousePosition: 'getMouseGlobalPositionPx'
  },
  model: {
    state: 'state',
    feed: 'feed',
    escape: 'escape',
    send: 'send',
    nested: 'model'
  },
  // OpenWG Gameface mods/libs/views.js and the client's own bundles: a tooltip is a view event the client answers with
  // its SimpleTooltipContent window, arguments wrapped as GFValueProxy.
  viewEvent: {
    handle: 'handleViewEvent',
    eventType: 'GFViewEventProxy',
    valueType: 'GFValueProxy',
    tooltip: 1,
    targetId: 0
  },
  tooltip: {
    content: ['views', 'common', 'tooltip_window', 'simple_tooltip_content', 'SimpleTooltipContent'],
    decorator: ['views', 'common', 'tooltip_window', 'tooltip_window', 'TooltipWindow'],
    resourceArg: 'resId'
  },
  // OpenWG Gameface mods/libs/sound.js and the client's own bundles: engine.call('PlaySound', name) with the client's
  // UI sounds, `highlight` on hover and `play` on a click.
  sound: {
    event: 'PlaySound',
    names: { hover: 'highlight', click: 'play' }
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
