export const STREAMERS_MOCK = {
  slug: 'stalevar',
  bio: 'Тяжи, отметки и честные челленджи от зрителей. Эфиры по будням с 19:00 МСК.',
  tickMs: 8_000,
  sessionStart: 9,
  sessionLength: 12,
  defaultExpiryMinutes: 120,
  damage: [4_120, 2_310, 5_604, 1_870, 3_390, 6_012],
  defaultMetrics: ['battles', 'winRate', 'avgDamage', 'wn8'],
  overlays: [
    { name: 'Сессия — основная', kind: 'session', theme: 'steel', layout: 'row', metrics: ['battles', 'winRate', 'avgDamage', 'wn8'] },
    { name: 'Отметка на Об. 140', kind: 'moe', theme: 'tracer', layout: 'column', metrics: ['moePercent', 'lastBattle'] }
  ],
  challenges: [
    {
      title: '3000 урона на ЛТ',
      status: 'active',
      amount: 500,
      donorName: 'Kolobanov_fan',
      minutesAgo: 25,
      condition: { metric: 'damage', value: 3_000, battles: 3, tankType: 'lightTank' },
      progress: { battles: 1, value: 2_140 }
    },
    {
      title: '5 фрагов за бой на X уровне',
      status: 'pending',
      amount: 1_000,
      donorName: null,
      minutesAgo: 8,
      condition: { metric: 'frags', value: 5, battles: 1, minTier: 10 },
      progress: null
    },
    {
      title: 'Выжить три боя подряд',
      status: 'succeeded',
      amount: 300,
      donorName: 'MasterOfArmor',
      minutesAgo: 140,
      condition: { metric: 'survive', value: 1, battles: 3 },
      progress: { battles: 3, value: 3 }
    },
    {
      title: '8000 заблокированного на ТТ',
      status: 'failed',
      amount: 750,
      donorName: 'Tiger_131',
      minutesAgo: 320,
      condition: { metric: 'blocked', value: 8_000, battles: 1, tankType: 'heavyTank' },
      progress: { battles: 1, value: 5_320 }
    }
  ]
} as const;
