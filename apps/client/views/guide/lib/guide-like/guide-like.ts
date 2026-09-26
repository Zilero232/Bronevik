import type { ApplyLikeInput, LikeState } from './guide-like.types';

export const applyLike = ({ state, liked }: ApplyLikeInput): LikeState =>
  state.liked === liked ? { liked, likesCount: state.likesCount } : { liked, likesCount: Math.max(0, state.likesCount + (liked ? 1 : -1)) };
