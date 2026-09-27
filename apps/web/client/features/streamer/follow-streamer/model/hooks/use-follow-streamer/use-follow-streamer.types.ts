export type FollowState = {
  isFollowing: boolean;
  tankId: number | null;
  followsCount: number;
  isSaving: boolean;
  onTankChange: (tankId: number | null) => void;
};
