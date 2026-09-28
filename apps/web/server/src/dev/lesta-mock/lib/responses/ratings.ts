import type { LestaMockEnvelope } from '../../lesta-mock.types';
import type { RankField } from '../rankings';
import type { MockContext, MockRoute, RankDeltaInput, RatingAccountInput, RatingTypeOfInput } from './responses.types';

import { MOCK_TIME } from '../../config';
import { selectFields } from '../fields';
import { globalRating } from '../profile';
import { fieldValue, isRankField, periodTotals, RANK_FIELDS, ranking, RANKINGS } from '../rankings';
import { playerStateAt } from '../simulation';
import { playerAt } from './account';
import { fail, idList, intParam, ok } from './envelope';
import { RATINGS_MOCK } from './responses.constants';

const RATING_TYPES: ReadonlySet<string> = new Set(RANKINGS.types);

const isRatingType = (value: string): value is RatingTypeOfInput['type'] => RATING_TYPES.has(value);

const rankFieldOf = (context: MockContext): { error: LestaMockEnvelope } | { field: RankField } => {
  const field = context.params.rank_field;

  if (!field) {
    return { error: fail({ code: 402, message: 'RANK_FIELD_NOT_SPECIFIED', field: 'rank_field' }) };
  }

  return isRankField(field) ? { field } : { error: fail({ code: 407, message: 'INVALID_RANK_FIELD', field: 'rank_field', value: field }) };
};

const typeOf = (context: MockContext): { error: LestaMockEnvelope } | { type: RatingTypeOfInput['type'] } => {
  const type = context.params.type;

  if (!type) {
    return { error: fail({ code: 402, message: 'TYPE_NOT_SPECIFIED', field: 'type' }) };
  }

  return isRatingType(type) ? { type } : { error: fail({ code: 407, message: 'INVALID_TYPE', field: 'type', value: type }) };
};

const ratingDate = (context: MockContext): number => {
  const date = intParam({ params: context.params, key: 'date', fallback: context.now });

  return Math.min(context.now, date);
};

const rankDelta = ({ context, field, accountId, at }: RankDeltaInput) => {
  const today = ranking({ world: context.world, field, at, depth: RATINGS_MOCK.depth }).rankOf.get(accountId);
  const yesterday = ranking({ world: context.world, field, at: at - MOCK_TIME.daySec, depth: RATINGS_MOCK.depth }).rankOf.get(accountId);

  return { rank: today ?? null, rank_delta: today === undefined || yesterday === undefined ? null : yesterday - today };
};

const ratingAccount = ({ context, accountId, type, at }: RatingAccountInput) => {
  const player = playerAt({ context, accountId });

  if (!player) {
    return null;
  }

  const random = periodTotals({ world: context.world, player, at, days: RANKINGS.periodDays[type] });

  if (random.battles < RANKINGS.thresholds[type]) {
    return null;
  }

  const rating = globalRating(playerStateAt({ world: context.world, player, at }));

  return {
    account_id: accountId,
    ...Object.fromEntries(
      RANK_FIELDS.map((field) => [field, { value: fieldValue({ field, random, rating }), ...rankDelta({ context, field, accountId, at }) }])
    )
  };
};

export const ratingsTypes: MockRoute = () =>
  ok({ data: Object.fromEntries(RANKINGS.types.map((type) => [type, { type, threshold: RANKINGS.thresholds[type], rank_fields: RANK_FIELDS }])) });

export const ratingsDates: MockRoute = (context) => {
  const today = Math.floor(context.now / MOCK_TIME.daySec) * MOCK_TIME.daySec;
  const dates = Array.from({ length: RANKINGS.datesKept }, (_, index) => today - index * MOCK_TIME.daySec);

  return ok({ data: Object.fromEntries(RANKINGS.types.map((type) => [type, { dates }])) });
};

export const ratingsTop: MockRoute = (context) => {
  const rank = rankFieldOf(context);
  const type = typeOf(context);

  if ('error' in rank) {
    return rank.error;
  }

  if ('error' in type) {
    return type.error;
  }

  const limit = Math.min(RATINGS_MOCK.maxTopLimit, Math.max(1, intParam({ params: context.params, key: 'limit', fallback: 10 })));
  const page = Math.max(1, intParam({ params: context.params, key: 'page_no', fallback: 1 }));
  const at = ratingDate(context);
  const table = ranking({ world: context.world, field: rank.field, at, depth: Math.ceil(page * limit * 1.3) + 50 });
  const previous = ranking({ world: context.world, field: rank.field, at: at - MOCK_TIME.daySec, depth: RATINGS_MOCK.depth });

  const data = table.entries.slice((page - 1) * limit, page * limit).map((entry, index) => {
    const position = (page - 1) * limit + index + 1;
    const before = previous.rankOf.get(entry.player.accountId);

    return selectFields({
      value: {
        account_id: entry.player.accountId,
        [rank.field]: { value: entry.value, rank: position, rank_delta: before === undefined ? null : before - position }
      },
      fields: context.fields
    });
  });

  return ok({ data, meta: { count: data.length } });
};

export const ratingsAccounts: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });
  const type = typeOf(context);

  if ('error' in parsed) {
    return parsed.error;
  }

  if ('error' in type) {
    return type.error;
  }

  const at = ratingDate(context);

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const account = ratingAccount({ context, accountId, type: type.type, at });

      return [String(accountId), account ? selectFields({ value: account, fields: context.fields }) : null];
    })
  );

  return ok({ data, meta: { count: parsed.ids.length } });
};

export const ratingsNeighbors: MockRoute = (context) => {
  const rank = rankFieldOf(context);
  const type = typeOf(context);
  const accountId = Number(context.params.account_id);

  if ('error' in rank) {
    return rank.error;
  }

  if ('error' in type) {
    return type.error;
  }

  const table = ranking({ world: context.world, field: rank.field, at: ratingDate(context), depth: RATINGS_MOCK.depth });
  const position = table.rankOf.get(accountId);
  const limit = Math.min(RATINGS_MOCK.maxNeighbors, Math.max(1, intParam({ params: context.params, key: 'limit', fallback: 5 })));

  if (position === undefined) {
    return ok({ data: [], meta: { count: 0 } });
  }

  const from = Math.max(0, position - 1 - limit);
  const data = table.entries.slice(from, position + limit).map((entry, index) => ({
    account_id: entry.player.accountId,
    [rank.field]: { value: entry.value, rank: from + index + 1, rank_delta: null }
  }));

  return ok({ data, meta: { count: data.length } });
};
