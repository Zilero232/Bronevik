export { CommunityCoreModule } from './community-core.module';
export type { AccountOfInput, ById, IdViewer, LikeInput, LikeResult, Owned, OwnedById, Viewer } from './community-core.types';
export {
  arenaIdSchema,
  authorSchema,
  IdParamsDto,
  LikeResultDto,
  likeResultSchema,
  moderationStatusSchema,
  playerStatsSchema,
  postStatusSchema,
  SlugParamsDto
} from './dto';
export { readRequirements, statRequirementsSchema, titleSlug, unmetRequirements } from './lib';
export type { PlayerStats, StatRequirements } from './lib';
export { toAuthorView, toPlayerStats } from './mappers';
export type { AuthorUser, AuthorView, NamesById, StatsByAccount } from './mappers';
export { AUTHOR_SELECT } from './selects';
export { CommunityAccountsService } from './services';
