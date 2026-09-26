export const PERSONAL_MISSION_FILES = {
  seasons: 'seasons.xml',
  tiles: 'tiles.xml',
  list: 'list.xml',
  config: 'sources/res/scripts/common/personal_missions_config.py',
  localization: 'sources/res/text/ru/lc_messages/personal_missions_details.po'
} as const;

export const PERSONAL_MISSION_CONFIG_NAMES = ['_config', '_config_pm2', '_config_pm3'] as const;

export const PERSONAL_MISSION_BRANCHES = ['regular', 'pm2', 'pm3'] as const;

export const PERSONAL_MISSION_TAGS = {
  initial: 'initial',
  final: 'final',
  withoutAdd: 'withoutAdd',
  levelGroupPrefix: 'LevelGroup',
  alliancePrefix: 'Alliance-'
} as const;

export const ALLIANCE_NATIONS: Record<string, readonly string[]> = {
  'Alliance-USSR': ['ussr', 'china'],
  'Alliance-Germany': ['germany', 'japan'],
  'Alliance-USA': ['usa', 'uk', 'poland'],
  'Alliance-France': ['france', 'czech', 'sweden', 'italy', 'intunion']
};

export const PERSONAL_MISSION_KEYS = {
  localizationPrefix: /^#[\w.-]+:/,
  missionName: /^(regular|pm2|pm3)_(\d+)_(\d+)_(\d+)$/,
  operationNode: /^(?:tail|tile)_\d+$/,
  operationReward: (seasonId: number, tileId: number) => `pt_final_s${seasonId}_t${tileId}`,
  campaignReward: (seasonId: number) => `pt_final_rewards_s${seasonId}`,
  conditionTitle: (mission: string, progressId: string) => `${mission}_title_${progressId}`,
  conditionDescription: (mission: string, progressId: string) => `${mission}_description_${progressId}`,
  placeholder: /%\((\w+)\)s/g,
  descriptionKind: /^DESCRIPTIONS\.(\w+)$/
} as const;

export const PERSONAL_MISSION_LOCALE = 'ru-RU';
