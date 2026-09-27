export const LOGGER = {
  service: {
    server: 'otmetki-server',
    worker: 'otmetki-worker'
  },
  pretty: {
    ignore: 'context',
    messageFormat: '{if context}[{context}] {end}{msg}'
  },
  http: {
    requestIdHeader: 'x-request-id',
    requestIdShape: /^[\w.-]{1,64}$/u,
    quietPaths: ['/health']
  }
} as const;
