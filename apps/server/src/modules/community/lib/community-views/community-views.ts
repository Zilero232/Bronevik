import type { Loadout } from '@bronevik/schemas';

import { loadoutSchema } from '@bronevik/schemas';
import slugify from '@sindresorhus/slugify';
import { z } from 'zod';

import type { AccountRating, Guide, User } from '../../../../../generated';
import type { BuildView, CommentView, GuideView, PlayerStats } from '../../community.types';
import type { AuthorView, CommentWithAuthor, GuideSlugInput, ToBuildViewInput, ToGuideViewInput } from './community-views.types';

import { toIso } from '../../../../common/lib';
import { COMMENT_TARGET_FROM_DB } from './community-views.constants';

const statsRecordSchema = z.record(z.string(), z.number().nullable());

const emptyLoadout: Loadout = { equipment: [], consumables: [], directives: [], ammo: [], crewSkills: {}, fieldModifications: [] };

export const toAuthorView = (user: Pick<User, 'id' | 'image' | 'name'>): AuthorView => ({
  id: user.id,
  name: user.name,
  image: user.image && /^https?:\/\//.test(user.image) ? user.image : null
});

export const toBuildView = ({ build, author, likedByMe, gameVersion }: ToBuildViewInput): BuildView => {
  const loadout = loadoutSchema.safeParse(build.loadout);
  const stats = statsRecordSchema.safeParse(build.stats);

  return {
    id: build.id,
    tankId: build.tankId,
    title: build.title,
    description: build.description,
    loadout: loadout.success ? loadout.data : emptyLoadout,
    stats: stats.success ? stats.data : null,
    author: toAuthorView(author),
    visibility: build.visibility,
    likesCount: build.likesCount,
    likedByMe,
    gameVersion,
    createdAt: build.createdAt.toISOString(),
    updatedAt: build.updatedAt.toISOString()
  };
};

export const toGuideView = ({ guide, author, likedByMe }: ToGuideViewInput): GuideView => ({
  id: guide.id,
  slug: guide.slug,
  kind: guide.kind,
  tankId: guide.tankId,
  arenaId: guide.arenaId,
  locale: guide.locale,
  title: guide.title,
  body: guide.body,
  status: guide.status,
  likesCount: guide.likesCount,
  likedByMe,
  author: toAuthorView(author),
  publishedAt: toIso(guide.publishedAt),
  createdAt: guide.createdAt.toISOString(),
  updatedAt: guide.updatedAt.toISOString()
});

export const toCommentView = (comment: CommentWithAuthor): CommentView => ({
  id: comment.id,
  target: COMMENT_TARGET_FROM_DB[comment.target],
  targetId: comment.targetId,
  parentId: comment.parentId,
  body: comment.status === 'published' ? comment.body : '',
  author: toAuthorView(comment.author),
  createdAt: comment.createdAt.toISOString()
});

export const toPlayerStats = (rating: Pick<AccountRating, 'battles' | 'winRate' | 'wn8'> | null | undefined): PlayerStats | null =>
  rating ? { battles: rating.battles, wn8: rating.wn8, winRate: rating.winRate } : null;

export const guideSlug = ({ title, suffix }: GuideSlugInput): string => `${slugify(title).slice(0, 80) || 'guide'}-${suffix}`;

export const isPublishedGuide = (guide: Pick<Guide, 'status'>): boolean => guide.status === 'published';
