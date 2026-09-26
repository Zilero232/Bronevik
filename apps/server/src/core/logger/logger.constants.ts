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
    quietPaths: ['/health']
  }
} as const;
