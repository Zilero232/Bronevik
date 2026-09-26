export const LOGGER = {
  service: {
    server: 'bronevik-server',
    worker: 'bronevik-worker'
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
