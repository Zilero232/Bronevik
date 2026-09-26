export { CommunityCoreModule } from './community-core.module';
export type { AccountOfInput, ById, IdViewer, LikeInput, LikeResult, Owned, OwnedById, Viewer } from './community-core.types';
export { AUTHOR_SELECT } from './config';
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
export { readRequirements, statRequirementsSchema, titleSlug, toAuthorView, toPlayerStats, unmetRequirements } from './lib';
export type { AuthorUser, AuthorView, NamesById, PlayerStats, StatRequirements, StatsByAccount } from './lib';
export { CommunityAccountsService } from './services';
