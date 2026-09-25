import type { LeaderboardScope } from '@bronevik/schemas';

export const LEADERBOARD_REQUEST = {
  limit: 50
} as const;

const THRESHOLD_SCOPES: readonly LeaderboardScope[] = ['players', 'risingStars', 'streamers'];

export const MOCK_LEADERBOARD = {
  clanColors: ['#c8102e', '#e0a526', '#3f8fd2', '#4caf6a', '#b061d8', '#ef7a3a'],
  minBattles: { overall: 1_000, '24h': 5, '7d': 20, '30d': 50, '60d': 100, '1000': 500 },
  thresholdScopes: THRESHOLD_SCOPES
} as const;

export const MOCK_LEADER_NICKNAMES = [
  'Lebwa_Fan',
  'Near_You_Vitalik',
  'Inspirer_2k',
  'Jove_Rider',
  'Amway921',
  'KorbenDallas_RU',
  'Bronya_Boss',
  'Tractorist_77',
  'Snayper_Molot',
  'Yashma',
  'Deda_na_IS',
  'Mehvod_Ivan',
  'Obkom_Party',
  'Kaban_Lesnoy',
  'Frau_Panzer',
  'Viking_Strv',
  'Hitman_Leo',
  'Zveroboy_152',
  'Batchat_Rush',
  'Pulemetchik',
  'Kombat_Rosa',
  'Klin_Clin',
  'Lyoha_Tarakan',
  'Ded_Maxim',
  'Tihiy_Don',
  'MaxiMus_T54',
  'Artillerist_Pro',
  'Babaha_4005',
  'Gnom_v_Kranvagne',
  'Stalnoy_Kulak',
  'Ohotnik_na_ST',
  'Sibirskiy_Medved',
  'LT_Glaz',
  'Pobeda_Ili_Smert',
  'Kapitan_Ochevidnost',
  'Tank_i_Tochka',
  'Grom_Bez_Molnii',
  'Utesnik',
  'Yastreb_Chernyy',
  'Kartoshka_Fri',
  'Umnyy_Tank'
] as const;
