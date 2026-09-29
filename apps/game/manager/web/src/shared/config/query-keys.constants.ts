export const QUERY_KEYS = {
  appInfo: ['app-info'],
  appUpdate: ['app-update'],
  catalog: ['catalog'],
  clients: ['clients'],
  settings: ['settings'],
  patchReport: ['patch-report'],
  installation: (clientPath: string | null) => ['installation', clientPath],
  installPlan: (clientPath: string | null) => ['install-plan', clientPath],
  profiles: (clientPath: string | null) => ['profiles', clientPath],
  snapshots: (clientPath: string | null) => ['snapshots', clientPath],
  conflicts: (clientPath: string | null) => ['conflicts', clientPath],
  sets: ['sets'],
  cachePlan: (clientPath: string | null) => ['cache-plan', clientPath]
} as const;
