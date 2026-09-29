import { match } from 'ts-pattern';

import type { PromoArt, ResolvedPromo, ResolvePromosInput } from './resolve-promos.types';

export const resolvePromos = <Id extends string>({ ids, specs, isModpackPublished, tanks }: ResolvePromosInput<Id>): ResolvedPromo<Id>[] =>
  ids.map((id) => {
    const spec = specs[id];
    const tank = spec.art.kind === 'tank' ? (tanks.at(spec.art.pick) ?? null) : null;
    const art = match(spec.art)
      .returnType<PromoArt>()
      .with({ kind: 'tank' }, () => ({ kind: 'tank', tank }))
      .otherwise((value) => value);

    return {
      id,
      tone: spec.tone,
      family: spec.family,
      state: spec.requires === 'modpack' && !isModpackPublished ? 'soon' : 'live',
      href: tank && spec.tankHref ? spec.tankHref(tank.slug) : spec.href,
      art
    };
  });
