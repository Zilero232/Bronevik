export const MOD_SYNC = {
  kinds: ['sets', 'profiles'],
  modes: ['merge', 'replace'],
  maxSets: 12,
  maxProfiles: 12,
  maxTombstones: 100,
  idPattern: /^[\w-]{1,64}$/,
  nameMaxLength: 40,
  maxComponents: 200,
  componentIdPattern: /^[a-z][a-z0-9_]*$/,
  componentIdMaxLength: 64,
  maxProfileDataBytes: 32 * 1024,
  clockSkewSeconds: 60,
  excludedConfigKeys: [
    'server_url',
    'bind_code',
    'settings_action',
    'settings_target',
    'settings_anonymous_stats',
    'share_settings',
    'upload_replays',
    'publish_replays'
  ],
  excludedConfigPrefixes: ['send_', 'settings_include_']
} as const;
