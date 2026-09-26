export const BUILD_URL = {
  primary: 'build',
  compare: 'vs'
} as const;

export const LOADOUT_CODE = {
  sectionSeparator: ';',
  keySeparator: ':',
  listSeparator: ',',
  roleSeparator: '|',
  roleAssign: '=',
  skillSeparator: '.',
  sections: { modules: 'm', equipment: 'e', consumables: 'c', directives: 'd', skills: 's', fieldMods: 'f' }
} as const;
