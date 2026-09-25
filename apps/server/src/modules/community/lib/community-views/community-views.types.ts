import type {
  Build,
  CoachingOffer,
  CoachProfile,
  Comment,
  Guide,
  PlatoonPost,
  RecruitingPost,
  Tournament,
  TournamentParticipant,
  User
} from '../../../../../generated';
import type { Bracket } from '../bracket';
import type { PlayerStats } from '../requirements';

export type AuthorUser = Pick<User, 'id' | 'image' | 'name'>;

export type AuthorView = {
  id: string;
  name: string;
  image: string | null;
};

export type ToBuildViewInput = {
  build: Build;
  author: AuthorUser;
  likedByMe: boolean;
  gameVersion: string | null;
};

export type ToGuideViewInput = {
  guide: Guide;
  author: AuthorUser;
  likedByMe: boolean;
};

export type CommentWithAuthor = Comment & {
  author: AuthorUser;
};

export type GuideSlugInput = {
  title: string;
  suffix: string;
};

export type StatsByAccount = ReadonlyMap<bigint, PlayerStats>;

export type NamesById = ReadonlyMap<bigint, string>;

export type PlatoonViewInput = {
  post: PlatoonPost;
  stats: StatsByAccount;
  nicknames: NamesById;
};

export type RecruitingViewInput = {
  post: RecruitingPost;
  stats: StatsByAccount;
  nicknames: NamesById;
  clanTags: NamesById;
};

export type CoachWithDetails = CoachProfile & {
  user: AuthorUser;
  offers: CoachingOffer[];
};

export type CoachViewInput = {
  coach: CoachWithDetails;
  stats: StatsByAccount;
};

export type TournamentWithParticipants = Tournament & {
  participants: TournamentParticipant[];
};

export type TournamentViewInput = {
  tournament: TournamentWithParticipants;
  nicknames: NamesById;
  bracket: Bracket | null;
  maxParticipants: number;
};
