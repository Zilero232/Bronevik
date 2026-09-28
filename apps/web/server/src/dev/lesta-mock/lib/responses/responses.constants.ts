export const RESPONSES = {
  maxIds: 100,
  maxListLimit: 100,
  minSearchLength: 3,
  minClanSearchLength: 2,
  nicknamePattern: /^\w{1,24}$/,
  tokenTtlSec: 14 * 86_400,
  loginPath: 'auth/login/',
  englishLanguage: 'en'
} as const;

export const ZERO_BLOCK_KEYS = {
  account: ['clan', 'company', 'historical', 'team', 'regular_team', 'globalmap_champion', 'globalmap_middle'],
  tank: ['clan', 'company', 'team', 'regular_team']
} as const;

export const CLAN_ROLE_TITLES = {
  commander: 'Командир',
  executive_officer: 'Заместитель командира',
  personnel_officer: 'Офицер штаба',
  combat_officer: 'Командир подразделения',
  intelligence_officer: 'Офицер разведки',
  quartermaster: 'Офицер снабжения',
  recruitment_officer: 'Офицер по кадрам',
  junior_officer: 'Младший офицер',
  private: 'Боец',
  recruit: 'Новобранец',
  reservist: 'Резервист'
} as const;

export const ENCYCLOPEDIA_LABELS = {
  languages: { ru: 'Русский', en: 'English', be: 'Беларуская', kk: 'Қазақ тілі', uk: 'Українська' },
  vehicleTypes: { lightTank: 'Лёгкий танк', mediumTank: 'Средний танк', heavyTank: 'Тяжёлый танк', 'AT-SPG': 'ПТ-САУ', SPG: 'САУ' },
  nations: {
    ussr: 'СССР',
    germany: 'Германия',
    usa: 'США',
    france: 'Франция',
    uk: 'Великобритания',
    china: 'Китай',
    japan: 'Япония',
    czech: 'Чехословакия',
    sweden: 'Швеция',
    poland: 'Польша',
    italy: 'Италия',
    intunion: 'Сборная наций'
  },
  crewRoles: { commander: 'Командир', gunner: 'Наводчик', driver: 'Механик-водитель', radioman: 'Радист', loader: 'Заряжающий' }
} as const;

export const PROVISION_TYPE_TO_API = {
  equipment: 'equipment',
  optional_device: 'optionalDevice',
  directive: 'directive',
  field_modification: 'fieldModification',
  consumable: 'equipment'
} as const;

export const STRONGHOLD_BUILDINGS = [
  { type: 'military_school', title: 'Военная академия' },
  { type: 'car_workshop', title: 'Автомастерская' },
  { type: 'artillery_division', title: 'Артиллерийский дивизион' },
  { type: 'bomber_wing', title: 'Бомбардировочная авиадивизия' },
  { type: 'training_ground', title: 'Учебный полигон' },
  { type: 'finance_department', title: 'Финансовый отдел' },
  { type: 'tank_school', title: 'Танковая школа' }
] as const;

export const STRONGHOLD_DIRECTIONS = ['A', 'B', 'C', 'D'] as const;

export const GLOBALMAP_FRONTS = [
  { id: 'basic_front', name: 'Основной фронт' },
  { id: 'advanced_front', name: 'Продвинутый фронт' },
  { id: 'elite_front', name: 'Элитный фронт' }
] as const;

export const GLOBALMAP_PRIME_TIMES = ['18:00', '19:00', '20:00', '21:00', '22:00'] as const;

export const RATINGS_MOCK = {
  depth: 50,
  maxTopLimit: 1000,
  maxNeighbors: 50
} as const;
