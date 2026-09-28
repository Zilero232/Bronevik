export const INSTALL_WIZARD = {
  steps: ['client', 'components', 'otherMods', 'review'],
  customPreset: 'custom',
  profileExtensions: ['ini'],
  lockedDependencyStates: ['ours', 'user']
} as const;
