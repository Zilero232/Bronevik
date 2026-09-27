export const BUILD_URL = {
  primary: 'build',
  compare: 'vs',
  preset: 'preset',
  mode: 'mode',
  cohort: 'cohort'
} as const;

export const BUILD_PRESETS = ['recommended'] as const;

export const LOADOUT_CODE = {
  sectionSeparator: ';',
  keySeparator: ':',
  listSeparator: ',',
  roleSeparator: '|',
  roleAssign: '=',
  skillSeparator: '.',
  sections: { modules: 'm', equipment: 'e', consumables: 'c', directives: 'd', skills: 's', fieldMods: 'f' }
} as const;
