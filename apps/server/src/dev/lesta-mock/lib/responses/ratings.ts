import type { LestaMockEnvelope } from '../../lesta-mock.types';
import type { RankField } from '../rankings';
import type { MockContext, MockRoute } from './responses.types';

import { MOCK_TIME } from '../../config';
import { selectFields } from '../fields';
import { isRankField, RANK_FIELDS, ranking, RANKINGS } from '../rankings';
import { fail, idList, intParam, ok } from './envelope';

const RATING_DEPTH = 200;

const RATING_TYPES: ReadonlySet<string> = new Set(RANKINGS.types);

const rankFieldOf = (context: MockContext): { error: LestaMockEnvelope } | { field: RankField } => {
  const field = context.params.rank_field;

  if (!field) {
    return { error: fail({ code: 402, message: 'RANK_FIELD_NOT_SPECIFIED', field: 'rank_field' }) };
  }

  return isRankField(field) ? { field } : { error: fail({ code: 407, message: 'INVALID_RANK_FIELD', field: 'rank_field', value: field }) };
};

const typeError = (context: MockContext) => {
  const type = context.params.type;

  if (!type) {
    return fail({ code: 402, message: 'TYPE_NOT_SPECIFIED', field: 'type' });
  }

  return RATING_TYPES.has(type) ? null : fail({ code: 407, message: 'INVALID_TYPE', field: 'type', value: type });
};

const ratingDate = (context: MockContext): number => {
  const date = intParam(context.params, 'date', context.now);

  return Math.min(context.now, date);
};

export const ratingsTypes: MockRoute = () =>
  ok(Object.fromEntries(RANKINGS.types.map((type) => [type, { type, threshold: RANKINGS.thresholds[type], rank_fields: RANK_FIELDS }])));

export const ratingsDates: MockRoute = (context) => {
  const today = Math.floor(context.now / MOCK_TIME.daySec) * MOCK_TIME.daySec;
  const dates = Array.from({ length: RANKINGS.datesKept }, (_, index) => today - index * MOCK_TIME.daySec);

  return ok(Object.fromEntries(RANKINGS.types.map((type) => [type, { dates }])));
};

export const ratingsTop: MockRoute = (context) => {
  const rank = rankFieldOf(context);
  const invalidType = typeError(context);

  if ('error' in rank) {
    return rank.error;
  }

  if (invalidType) {
    return invalidType;
  }

  const limit = Math.min(1000, Math.max(1, intParam(context.params, 'limit', 10)));
  const page = Math.max(1, intParam(context.params, 'page_no', 1));
  const table = ranking({ world: context.world, field: rank.field, at: ratingDate(context), depth: Math.ceil(page * limit * 1.3) + 50 });
  const data = table.entries.slice((page - 1) * limit, page * limit).map((entry, index) =>
    selectFields(
      {
        account_id: entry.player.accountId,
        [rank.field]: { value: entry.value, rank: (page - 1) * limit + index + 1, rank_delta: null }
      },
      context.fields
    )
  );

  return ok(data, { count: data.length });
};

export const ratingsAccounts: MockRoute = (context) => {
  const parsed = idList({ params: context.params, field: 'account_id' });
  const invalidType = typeError(context);

  if ('error' in parsed) {
    return parsed.error;
  }

  if (invalidType) {
    return invalidType;
  }

  const at = ratingDate(context);
  const tables = RANK_FIELDS.slice(0, 3).map((field) => ({ field, table: ranking({ world: context.world, field, at, depth: RATING_DEPTH }) }));

  const data = Object.fromEntries(
    parsed.ids.map((accountId) => {
      const ranked = tables.flatMap(({ field, table }) => {
        const rank = table.rankOf.get(accountId);
        const entry = rank === undefined ? undefined : table.entries[rank - 1];

        return entry && rank !== undefined ? [[field, { value: entry.value, rank, rank_delta: null }] as const] : [];
      });

      return [String(accountId), ranked.length > 0 ? selectFields({ account_id: accountId, ...Object.fromEntries(ranked) }, context.fields) : null];
    })
  );

  return ok(data, { count: parsed.ids.length });
};

export const ratingsNeighbors: MockRoute = (context) => {
  const rank = rankFieldOf(context);
  const accountId = Number(context.params.account_id);

  if ('error' in rank) {
    return rank.error;
  }

  const table = ranking({ world: context.world, field: rank.field, at: ratingDate(context), depth: RATING_DEPTH });
  const position = table.rankOf.get(accountId);
  const limit = Math.min(50, Math.max(1, intParam(context.params, 'limit', 5)));

  if (position === undefined) {
    return ok([], { count: 0 });
  }

  const from = Math.max(0, position - 1 - limit);
  const data = table.entries.slice(from, position + limit).map((entry, index) => ({
    account_id: entry.player.accountId,
    [rank.field]: { value: entry.value, rank: from + index + 1, rank_delta: null }
  }));

  return ok(data, { count: data.length });
};
