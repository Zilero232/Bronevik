export type LikeState = {
  liked: boolean;
  likesCount: number;
};

export type ApplyLikeInput = {
  state: LikeState;
  liked: boolean;
};
