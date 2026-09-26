export const VEHICLE_SOURCES = {
  editorRoles: ['admin', 'moderator']
} as const;

export const VEHICLE_SOURCE_EVENT = { select: { slug: true, title: true, url: true, startsAt: true, endsAt: true } } as const;
