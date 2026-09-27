import type { Follow, Prisma, PrismaClient } from '../../../../../generated';

export type FollowFlags = Pick<Follow, 'isFavorite' | 'isFollowing'>;
export type FollowFlag = keyof FollowFlags;

export type FollowFlagConfig = {
  on: Partial<FollowFlags>;
  only: FollowFlags;
  reset: Prisma.FollowUpdateManyMutationInput;
};

export type FollowKey = Pick<Follow, 'kind' | 'targetId' | 'userId'>;

export type SetFollowFlagInput = {
  prisma: Pick<PrismaClient, 'follow'>;
  flag: FollowFlag;
  key: FollowKey;
  data?: Pick<Prisma.FollowUncheckedCreateInput, 'isOwn' | 'label'>;
};

export type ClearFollowFlagInput = {
  prisma: Pick<PrismaClient, '$transaction'>;
  flag: FollowFlag;
  where: Prisma.FollowWhereInput;
};
