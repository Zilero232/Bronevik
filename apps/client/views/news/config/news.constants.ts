export const NEWS = {
  filters: ['all', 'news', 'patch_notes', 'dev_blog'],
  pageSize: 20,
  staleMs: 5 * 60_000,
  skeletons: 6,
  kindTone: { news: 'steel', patch_notes: 'accent', dev_blog: 'premium' }
} as const;
