export type Point = [number, number];

export type ArenaGameplay = {
  type: string;
  minimap?: string;
  minimapImage?: string;
  teamBasePositions: Record<string, Point[]>;
  teamSpawnPoints: Record<string, Point[]>;
  controlPoints: Point[];
};

export type ArenaListEntry = {
  id: number;
  name: string;
};

export type Arena = {
  arenaId: string;
  numericId?: number;
  nameKey?: string;
  displayName: string;
  descriptionKey?: string;
  geometry?: string;
  boundingBox: { bottomLeft: Point; upperRight: Point };
  sizeMeters: number;
  camouflageKind?: string;
  maxPlayersInTeam?: number;
  roundLength?: number;
  minimap?: string;
  minimapImage: string;
  gameplayTypes: string[];
  gameplay: ArenaGameplay[];
};

export type ParseArenaInput = {
  xml: string;
  arenaId: string;
  numericId?: number;
};

export type MinimapImagePathInput = {
  minimap: string | undefined;
  arenaId: string;
};
