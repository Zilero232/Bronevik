// Section roots without a page of their own (an entity prefix like /p/:nick, or a nested route like
// /p/:nick/sessions/:id) send visitors to the page that lists those entities instead of a 404.
const SECTION_ROOTS = [
  { source: '/competitions', destination: '/tournaments?tab=points' },
  { source: '/p', destination: '/players' },
  { source: '/c', destination: '/clans' },
  { source: '/s', destination: '/streamers' },
  { source: '/compare', destination: '/compare/players' },
  { source: '/play', destination: '/tools' },
  { source: '/p/:nick/sessions', destination: '/p/:nick' },
  { source: '/p/:nick/wrapped', destination: '/p/:nick' },
  { source: '/missions/:campaign', destination: '/missions' },
  { source: '/me/analytics/tanks', destination: '/me/analytics' }
] as const;

export const LEGACY_REDIRECTS = SECTION_ROOTS.flatMap(({ source, destination }) => [
  { source, destination, permanent: true },
  { source: `/:locale(en)${source}`, destination: `/:locale${destination}`, permanent: true }
]);
