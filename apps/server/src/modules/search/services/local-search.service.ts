import { Injectable } from '@nestjs/common';

import type { ClanMatchRow, MapMatchRow, PlayerMatchRow, TankMatchRow, TermsInput } from '../search.types';

import { PrismaService } from '../../../core';
import { escapeLike } from '../lib';

@Injectable()
export class LocalSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async players({ terms, limit }: TermsInput): Promise<PlayerMatchRow[]> {
    if (terms.length === 0) {
      return [];
    }

    const patterns = terms.map((term) => `${escapeLike(term)}%`);

    return this.prisma.$queryRaw<PlayerMatchRow[]>`
      WITH q AS (SELECT * FROM unnest(${terms}::text[], ${patterns}::text[]) AS q(term, pattern)),
      current_matches AS (
        SELECT p.account_id, NULL::text AS matched, q.term,
               similarity(p.nickname, q.term) AS score,
               lower(p.nickname) = lower(q.term) AS exact,
               p.nickname ILIKE q.pattern AS prefix
        FROM player p JOIN q ON p.nickname ILIKE q.pattern OR p.nickname % q.term
        WHERE NOT p.is_hidden
      ),
      history_matches AS (
        SELECT h.account_id, h.nickname AS matched, q.term,
               similarity(h.nickname, q.term) * 0.9 AS score,
               lower(h.nickname) = lower(q.term) AS exact,
               h.nickname ILIKE q.pattern AS prefix
        FROM player_nickname_history h JOIN q ON h.nickname ILIKE q.pattern OR h.nickname % q.term
      ),
      ranked AS (
        SELECT DISTINCT ON (m.account_id) m.*
        FROM (SELECT * FROM current_matches UNION ALL SELECT * FROM history_matches) m
        ORDER BY m.account_id, m.exact DESC, m.prefix DESC, m.score DESC
      )
      SELECT p.account_id AS "accountId", p.nickname, c.tag AS "clanTag",
             CASE WHEN r.matched IS NOT NULL AND r.matched <> p.nickname THEN r.matched END AS "matchedNickname",
             ar.wn8, ar.battles, r.score::float8 AS score, r.exact, r.term
      FROM ranked r
      JOIN player p ON p.account_id = r.account_id AND NOT p.is_hidden
      LEFT JOIN clan c ON c.clan_id = p.clan_id
      LEFT JOIN account_rating ar ON ar.account_id = p.account_id AND ar.period = 'overall'::rating_period
      ORDER BY r.exact DESC, r.prefix DESC, r.score DESC, ar.battles DESC NULLS LAST
      LIMIT ${limit}
    `;
  }

  async clans({ terms, limit }: TermsInput): Promise<ClanMatchRow[]> {
    if (terms.length === 0) {
      return [];
    }

    const patterns = terms.map((term) => `${escapeLike(term)}%`);

    return this.prisma.$queryRaw<ClanMatchRow[]>`
      WITH q AS (SELECT * FROM unnest(${terms}::text[], ${patterns}::text[]) AS q(term, pattern))
      SELECT c.clan_id AS "clanId", c.tag, c.name, c.members_count AS "membersCount", c.emblems,
             max(greatest(similarity(c.tag, q.term), similarity(c.name, q.term)))::float8 AS score,
             bool_or(lower(c.tag) = lower(q.term)) AS exact
      FROM clan c JOIN q ON c.tag ILIKE q.pattern OR c.name ILIKE q.pattern OR c.tag % q.term OR c.name % q.term
      WHERE NOT c.is_disbanded
      GROUP BY c.clan_id
      ORDER BY exact DESC, score DESC, c.members_count DESC
      LIMIT ${limit}
    `;
  }

  async tanks({ terms, limit }: TermsInput): Promise<TankMatchRow[]> {
    if (terms.length === 0) {
      return [];
    }

    const patterns = terms.map((term) => `%${escapeLike(term)}%`);

    return this.prisma.$queryRaw<TankMatchRow[]>`
      WITH q AS (SELECT * FROM unnest(${terms}::text[], ${patterns}::text[]) AS q(term, pattern))
      SELECT v.tank_id AS "tankId",
             max(greatest(similarity(v.name, q.term), similarity(v.short_name, q.term),
                          similarity(replace(v.short_name, '-', ''), replace(q.term, '-', ''))))::float8 AS score,
             (array_agg(q.term))[1] AS term
      FROM vehicle v JOIN q ON v.name ILIKE q.pattern OR v.short_name ILIKE q.pattern OR v.name % q.term
                             OR replace(v.short_name, '-', '') ILIKE replace(q.pattern, '-', '')
      WHERE v.is_active
      GROUP BY v.tank_id, v.tier
      ORDER BY score DESC, v.tier DESC
      LIMIT ${limit}
    `;
  }

  async maps({ terms, limit }: TermsInput): Promise<MapMatchRow[]> {
    if (terms.length === 0) {
      return [];
    }

    const patterns = terms.map((term) => `%${escapeLike(term)}%`);

    return this.prisma.$queryRaw<MapMatchRow[]>`
      WITH q AS (SELECT * FROM unnest(${terms}::text[], ${patterns}::text[]) AS q(term, pattern))
      SELECT a.arena_id AS "arenaId", a.slug, a.name, a.image, max(similarity(a.name, q.term))::float8 AS score
      FROM arena a JOIN q ON a.name ILIKE q.pattern OR a.name % q.term
      WHERE a.is_active
      GROUP BY a.arena_id
      ORDER BY score DESC
      LIMIT ${limit}
    `;
  }
}
