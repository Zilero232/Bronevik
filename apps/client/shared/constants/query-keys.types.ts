export type PlayerSection = 'activity' | 'history' | 'insights' | 'marks' | 'nicknames' | 'playtime' | 'session' | 'sessions' | 'tanks';

export type PlayerSectionKeyInput = {
  accountId: number;
  section: PlayerSection;
  params?: object;
};

export type MeSection = 'accounts' | 'devices' | 'favorites' | 'goals' | 'notifications';
