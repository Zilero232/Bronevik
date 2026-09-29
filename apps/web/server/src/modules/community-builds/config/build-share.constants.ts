export const BUILD_SHARE = {
  popularLimit: 10,
  publicWhere: { visibility: 'public', status: 'published' },
  order: {
    popular: [{ likesCount: 'desc' }, { createdAt: 'desc' }],
    recent: [{ createdAt: 'desc' }]
  }
} as const;
