export const LOGGER = {
  service: {
    server: 'bronevik-server',
    worker: 'bronevik-worker'
  },
  pretty: {
    ignore: 'context',
    messageFormat: '[{context}] {msg}'
  }
} as const;
