export type MockVehicleType = 'AT-SPG' | 'heavyTank' | 'lightTank' | 'mediumTank' | 'SPG';

export type MockExpected = {
  damage: number;
  frags: number;
  spot: number;
  def: number;
  winRate: number;
};

export type MockShell = {
  shellId: number;
  kind: string;
  isPremium: boolean;
  portion: number;
  price: number;
  currency: string;
};

export type MockCrewMember = {
  role: string;
  extraRoles: string[];
};

export type MockVehicle = {
  tankId: number;
  name: string;
  shortName: string;
  tag: string | null;
  nation: string;
  type: MockVehicleType;
  tier: number;
  isPremium: boolean;
  isCollectible: boolean;
  isGift: boolean;
  isWheeled: boolean;
  playable: boolean;
  priceCredit: number | null;
  priceGold: number | null;
  description: string | null;
  hp: number;
  expected: MockExpected;
  crew: MockCrewMember[];
  shells: MockShell[];
  maxAmmo: number;
  prevTankIds: number[];
  moduleIds: number[];
};

export type MockProvision = {
  provisionId: number;
  name: string;
  tag: string | null;
  type: string;
  description: string | null;
  priceCredit: number | null;
  priceGold: number | null;
  weight: number | null;
  tankIds: readonly number[];
};

export type MockModule = {
  moduleId: number;
  name: string;
  type: string;
  nation: string;
  tier: number;
  priceCredit: number | null;
  weight: number | null;
  tankIds: readonly number[];
};

export type MockArena = {
  arenaId: string;
  name: string;
  description: string | null;
  camouflageType: string | null;
  modes: readonly string[];
};

export type MockCrewSkill = {
  skill: string;
  name: string;
  type: string | null;
  roles: readonly string[];
  isCommon: boolean;
  description: string | null;
};

export type MockCrewRole = {
  role: string;
  name: string;
  skills: readonly string[];
};

export type MockCatalog = {
  gameVersion: string;
  tanksUpdatedAt: number;
  vehicles: MockVehicle[];
  vehicleById: ReadonlyMap<number, MockVehicle>;
  provisions: MockProvision[];
  modules: MockModule[];
  arenas: MockArena[];
  crewSkills: MockCrewSkill[];
  crewRoles: MockCrewRole[];
};

export type MockActivity = 'casual' | 'lapsed' | 'regular';

export type MockClanStint = {
  clanId: number;
  joinedAt: number;
  leftAt: number | null;
  role: string;
};

export type MockPlayer = {
  index: number;
  accountId: number;
  nickname: string;
  createdAt: number;
  skill: number;
  winSkill: number;
  drift: number;
  careerBattles: number;
  activity: MockActivity;
  dayChance: number;
  sessionBattles: number;
  sessionHour: number;
  lastBattleBeforeAnchor: number;
  premiumShare: number;
  stints: MockClanStint[];
};

export type MockClanTier = 'mid' | 'small' | 'top';

export type MockClanMembership = {
  player: MockPlayer;
  stint: MockClanStint;
};

export type MockClan = {
  index: number;
  clanId: number;
  tag: string;
  name: string;
  motto: string;
  description: string;
  color: string;
  createdAt: number;
  tier: MockClanTier;
  strongholdLevel: number;
  onGlobalMap: boolean;
  elo: { 6: number; 8: number; 10: number };
  oldTag: string | null;
  oldName: string | null;
  renamedAt: number | null;
  acceptsJoinRequests: boolean;
  memberships: MockClanMembership[];
};

export type MockWorld = {
  seed: number;
  anchor: number;
  anchorDay: number;
  catalog: MockCatalog;
  players: MockPlayer[];
  playerByAccountId: ReadonlyMap<number, MockPlayer>;
  nicknames: readonly (readonly [string, MockPlayer])[];
  clans: MockClan[];
  clanById: ReadonlyMap<number, MockClan>;
};

export type MockGarageTank = {
  vehicle: MockVehicle;
  baseBattles: number;
  weight: number;
  affinity: number;
  availableFromDay: number;
  otherShare: number;
};

export type MockGarage = {
  tanks: MockGarageTank[];
  byTankId: ReadonlyMap<number, MockGarageTank>;
};

export type MockTotals = {
  battles: number;
  wins: number;
  losses: number;
  draws: number;
  damageDealt: number;
  damageReceived: number;
  frags: number;
  spotted: number;
  xp: number;
  survived: number;
  survivedWins: number;
  hits: number;
  shots: number;
  piercings: number;
  explosionHits: number;
  directHitsReceived: number;
  noDamageDirectHitsReceived: number;
  piercingsReceived: number;
  explosionHitsReceived: number;
  capturePoints: number;
  droppedCapturePoints: number;
  damageBlocked: number;
  assistedRadio: number;
  assistedTrack: number;
  stunAssisted: number;
  stunNumber: number;
  maxDamage: number;
  maxFrags: number;
  maxXp: number;
};

export type MockBattleMode = 'comp7' | 'frontline' | 'random' | 'ranked';

export type MockBattle = {
  endedAt: number;
  durationSec: number;
  lifetimeSec: number;
  tankId: number;
  mode: MockBattleMode;
  result: 'draw' | 'loss' | 'win';
  team: number;
  damageDealt: number;
  assistedRadio: number;
  assistedTrack: number;
  stunAssisted: number;
  stunNumber: number;
  damageBlocked: number;
  damageReceived: number;
  frags: number;
  spotted: number;
  xp: number;
  survived: boolean;
  shots: number;
  hits: number;
  piercings: number;
  explosionHits: number;
  directHitsReceived: number;
  noDamageDirectHitsReceived: number;
  capturePoints: number;
  droppedCapturePoints: number;
  moeEma: number;
  moePercent: number;
  marksOnGun: number;
  premiumAccount: boolean;
};

export type MockTankState = {
  vehicle: MockVehicle;
  random: MockTotals;
  other: MockTotals;
  lastBattle: number;
  moeEma: number;
  bestMoePercent: number;
};

export type MockPlayerState = {
  at: number;
  lastBattle: number;
  tanks: Map<number, MockTankState>;
};

export type LestaMockEnvelope =
  | { status: 'error'; error: { code: number; message: string; field: string | null; value: string | null } }
  | { status: 'ok'; meta: Record<string, number>; data: unknown };

export type LestaMockParams = Readonly<Record<string, string>>;

export type LestaMockCall = {
  method: string;
  params: LestaMockParams;
  now: number;
  loginUrl: string;
};

export type LestaMockHandler = (call: LestaMockCall) => LestaMockEnvelope;
