import type { ClanMemberEvent, ClanRole } from '@bronevik/schemas';

export const CLAN_MOCK = {
  now: '2026-09-24T09:00:00+03:00',
  eventCount: 48,
  eventTypes: ['joined', 'joined', 'left', 'kicked', 'role_changed'] satisfies ClanMemberEvent['type'][],
  roleLadder: [
    { role: 'commander', until: 1 },
    { role: 'executive_officer', until: 3 },
    { role: 'personnel_officer', until: 5 },
    { role: 'combat_officer', until: 9 },
    { role: 'recruitment_officer', until: 11 },
    { role: 'junior_officer', until: 18 },
    { role: 'private', until: 90 },
    { role: 'recruit', until: 96 },
    { role: 'reservist', until: 1_000 }
  ] satisfies { role: ClanRole; until: number }[],
  nickStarts: ['Stalnoy', 'Tigr', 'Volk', 'Grom', 'Bronya', 'Snayper', 'Tank', 'Ohotnik', 'Veter', 'Zenit', 'Kapitan', 'Medved', 'Sokol', 'Shturm'],
  nickEnds: ['Kulak', 'Rus', 'Mayor', 'Hunter', 'Pro', 'Lis', 'Ded', 'Boss', 'Vzvod', 'Straj', 'Molot', 'Kot'],
  colors: ['#ff6b1a', '#3fa9f5', '#4cc36b', '#b16cff', '#f2c94c', '#e5484d'],
  mottos: ['Броня крепка, и танки наши быстры', 'Никто, кроме нас', 'Тише едешь — дальше будешь', 'Сила в единстве'],
  buildings: [
    { type: 'COMMAND_CENTER', title: 'Командный центр' },
    { type: 'ARTILLERY_DIVISION', title: 'Артиллерийский дивизион' },
    { type: 'ENGINEERING_BATTALION', title: 'Инженерный батальон' },
    { type: 'TANK_SCHOOL', title: 'Танковая школа' },
    { type: 'MILITARY_SCHOOL', title: 'Военное училище' },
    { type: 'TRANSPORT_DEPOT', title: 'Транспортный отдел' }
  ],
  reserves: [
    { type: 'TACTICAL_TRAINING', title: 'Тактическая подготовка', bonusType: 'crew_experience' },
    { type: 'BATTLE_PAYMENTS', title: 'Боевые выплаты', bonusType: 'credits' },
    { type: 'MILITARY_MANEUVERS', title: 'Военные учения', bonusType: 'experience' }
  ],
  reservesClanId: 1,
  skirmishTiers: [6, 8, 10],
  provinces: ['Прохоровка', 'Энск', 'Малиновка', 'Химмельсдорф', 'Рудники', 'Утёс', 'Ласвилль', 'Мурованка']
} as const;

export const CLAN_REQUEST = {
  eventsLimit: 25,
  listLimit: 50
} as const;
