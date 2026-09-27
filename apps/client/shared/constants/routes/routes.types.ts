export type PlayerSessionRouteInput = {
  nickname: string;
  sessionId: string;
};

export type MissionOperationRouteInput = {
  campaign: number;
  operation: number;
};

export type TreeTankRouteInput = {
  nation: string;
  tankId: number;
};

export type PlayerWrappedRouteInput = {
  nickname: string;
  year: number;
};
