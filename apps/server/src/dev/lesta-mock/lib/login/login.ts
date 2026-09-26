import type { Request, Response } from 'express';

import { escapeUTF8 } from 'entities';
import { Router } from 'express';
import { sortBy } from 'remeda';

import type { MockPlayer, MockWorld } from '../../lesta-mock.types';
import type { LoginRouterInput, PickerRow } from './login.types';

import { LESTA_MOCK } from '../../../../config';
import { damageRatio, targetWinRate } from '../skill';
import { nowUnix } from '../time';
import { mockAccessToken } from '../token';
import { stintAt } from '../world';
import { LOGIN } from './login.constants';

const text = (value: unknown): string => (typeof value === 'string' ? value : '');

const isAllowedRedirect = (redirectUri: string, apiUrl: string): boolean =>
  URL.canParse(redirectUri) && new URL(redirectUri).origin === new URL(apiUrl).origin;

const rowOf = (world: MockWorld, player: MockPlayer): PickerRow => {
  const stint = stintAt(player, nowUnix());

  return {
    player,
    clanTag: stint ? (world.clanById.get(stint.clanId)?.tag ?? null) : null,
    winRate: targetWinRate(player),
    rating: damageRatio(player)
  };
};

const suggestions = (world: MockWorld): PickerRow[] => {
  const active = world.players.filter((player) => player.activity === 'regular');
  const ranked = sortBy(active, [(player) => player.skill, 'desc']);
  const middle = Math.floor(ranked.length / 2);

  return [
    ...ranked.slice(0, LOGIN.top),
    ...ranked.slice(middle, middle + LOGIN.average),
    ...ranked.slice(-LOGIN.weak),
    ...sortBy(world.players, [(player) => player.createdAt, 'desc']).slice(0, LOGIN.fresh)
  ].map((player) => rowOf(world, player));
};

const search = (world: MockWorld, query: string): PickerRow[] => {
  const lower = query.toLowerCase();

  return world.nicknames
    .filter(([nickname]) => nickname.includes(lower))
    .slice(0, LOGIN.searchLimit)
    .map(([, player]) => rowOf(world, player));
};

const page = (request: Request, rows: readonly PickerRow[]): string => {
  const query = new URLSearchParams(Object.entries(request.query).map(([key, value]): [string, string] => [key, text(value)]));
  const confirm = (player: MockPlayer) => {
    const target = new URLSearchParams(query);

    target.set('account_id', String(player.accountId));
    target.delete('q');

    return `confirm/?${target.toString()}`;
  };

  const cancel = new URLSearchParams(query);

  cancel.set('cancel', '1');

  const items = rows
    .map(
      ({ player, clanTag, winRate }) => `<tr>
  <td><a href="${escapeUTF8(confirm(player))}">${escapeUTF8(player.nickname)}</a></td>
  <td>${clanTag ? `[${escapeUTF8(clanTag)}]` : '—'}</td>
  <td>${player.accountId}</td>
  <td>${player.careerBattles.toLocaleString('ru-RU')}</td>
  <td>${winRate.toFixed(1)}%</td>
</tr>`
    )
    .join('\n');

  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${LOGIN.title}</title>
<style>body{font:14px/1.4 system-ui,sans-serif;margin:24px auto;max-width:760px;padding:0 16px;background:#111;color:#eee}
a{color:#f5b841}table{width:100%;border-collapse:collapse}td,th{padding:6px 8px;border-bottom:1px solid #333;text-align:left}
input{padding:6px 8px;width:60%}button{padding:6px 12px}.note{color:#999}</style></head>
<body><h1>${LOGIN.title}</h1><p class="note">${LOGIN.note}</p>
<form method="get">${[...query]
    .filter(([key]) => key !== 'q')
    .map(([key, value]) => `<input type="hidden" name="${escapeUTF8(key)}" value="${escapeUTF8(value)}">`)
    .join(
      ''
    )}<input name="q" placeholder="${LOGIN.searchPlaceholder}" value="${escapeUTF8(query.get('q') ?? '')}"> <button>${LOGIN.searchButton}</button></form>
<table><thead><tr><th>Никнейм</th><th>Клан</th><th>ID</th><th>Боёв</th><th>Побед</th></tr></thead><tbody>${items}</tbody></table>
<p><a href="confirm/?${escapeUTF8(cancel.toString())}">${LOGIN.cancel}</a></p></body></html>`;
};

const redirectWith = (redirectUri: string, values: Record<string, string>): string => {
  const target = new URL(redirectUri);

  for (const [key, value] of Object.entries(values)) {
    target.searchParams.set(key, value);
  }

  return target.toString();
};

export const createLoginRouter = ({ world, apiUrl }: LoginRouterInput): Router => {
  const base = `${LESTA_MOCK.mountPath}${LESTA_MOCK.gamePath}${LOGIN.path}`;
  const router = Router();

  const guard = (request: Request, response: Response): string | null => {
    const redirectUri = text(request.query.redirect_uri);

    if (text(request.query.application_id) !== LESTA_MOCK.applicationId || !isAllowedRedirect(redirectUri, apiUrl)) {
      response.status(400).type('text/plain').send(LOGIN.invalidRequest);

      return null;
    }

    return redirectUri;
  };

  router.get(base, (request, response) => {
    if (guard(request, response) === null) {
      return;
    }

    const query = text(request.query.q).trim();

    response.type('html').send(page(request, query.length >= LOGIN.minQuery ? search(world, query) : suggestions(world)));
  });

  router.get(`${base}confirm/`, (request, response) => {
    const redirectUri = guard(request, response);

    if (redirectUri === null) {
      return;
    }

    if (text(request.query.cancel) === '1') {
      response.redirect(redirectWith(redirectUri, { status: 'error', code: 'AUTH_CANCEL', message: 'User not authorized' }));

      return;
    }

    const player = world.playerByAccountId.get(Number(text(request.query.account_id)));

    if (!player) {
      response.status(404).type('text/plain').send(LOGIN.unknownAccount);

      return;
    }

    const expiresAt = Number(text(request.query.expires_at)) || nowUnix() + LOGIN.tokenTtlSec;

    response.redirect(
      redirectWith(redirectUri, {
        status: 'ok',
        access_token: mockAccessToken(world.seed, player.accountId),
        nickname: player.nickname,
        account_id: String(player.accountId),
        expires_at: String(expiresAt)
      })
    );
  });

  return router;
};
