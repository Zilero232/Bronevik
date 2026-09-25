export const DEVELOPER_PATHS = {
  overview: '/me/developer',
  keys: '/me/developer/keys',
  key: (id: string) => `/me/developer/keys/${id}`,
  usage: (id: string) => `/me/developer/keys/${id}/usage`,
  errors: (id: string) => `/me/developer/keys/${id}/errors`,
  webhooks: '/me/developer/webhooks',
  webhook: (id: string) => `/me/developer/webhooks/${id}`,
  deliveries: (id: string) => `/me/developer/webhooks/${id}/deliveries`,
  spec: '/v1/docs/openapi.json',
  docs: '/v1/docs'
} as const;
