import { RadioIcon } from '@otmetki/icons';
import { Gamepad2, Sigma, Trophy } from 'lucide-react';

import { ROUTES } from '@/shared/constants';

import type { PromoSpec } from '../lib/resolve-promos';

const MOD_SHOWCASE_HREF = `${ROUTES.mod}#showcase`;

export const PROMO_ITEMS = {
  modpack: { href: ROUTES.mod, tone: 'accent', family: 'site', requires: 'modpack', art: { kind: 'mock', mock: 'manager' } },
  marksPanel: { href: MOD_SHOWCASE_HREF, tone: 'gold', family: 'mod', requires: 'modpack', art: { kind: 'mock', mock: 'marks' } },
  teamHp: { href: MOD_SHOWCASE_HREF, tone: 'olive', family: 'mod', requires: 'modpack', art: { kind: 'mock', mock: 'teamHp' } },
  damageLog: { href: MOD_SHOWCASE_HREF, tone: 'battle', family: 'mod', requires: 'modpack', art: { kind: 'mock', mock: 'damageLog' } },
  crosshair: { href: MOD_SHOWCASE_HREF, tone: 'sky', family: 'mod', requires: 'modpack', art: { kind: 'mock', mock: 'crosshair' } },
  gear: { href: MOD_SHOWCASE_HREF, tone: 'brass', family: 'mod', requires: 'modpack', art: { kind: 'mock', mock: 'gear' } },
  hits: { href: MOD_SHOWCASE_HREF, tone: 'battle', family: 'mod', requires: 'modpack', art: { kind: 'mock', mock: 'hits' } },
  plus: { href: ROUTES.plus, tone: 'gold', family: 'site', art: { kind: 'tank', pick: 3 } },
  armor: { href: ROUTES.tanks.list, tankHref: ROUTES.tanks.armor, tone: 'sky', family: 'site', art: { kind: 'tank', pick: 0 } },
  builds: { href: ROUTES.builds.list, tone: 'olive', family: 'site', art: { kind: 'tank', pick: 1 } },
  marks: { href: ROUTES.marks, tone: 'gold', family: 'site', art: { kind: 'tank', pick: 2 } },
  ratings: { href: ROUTES.ratings, tone: 'steel', family: 'site', art: { kind: 'emblem', icon: Sigma } },
  play: { href: ROUTES.play.hub, tone: 'accent', family: 'site', art: { kind: 'emblem', icon: Gamepad2 } },
  tournaments: { href: ROUTES.tournaments.list, tone: 'battle', family: 'site', art: { kind: 'emblem', icon: Trophy } },
  streamers: { href: ROUTES.streamers.forStreamers, tone: 'sky', family: 'site', art: { kind: 'emblem', icon: RadioIcon } }
} as const satisfies Record<string, PromoSpec>;

export type PromoId = keyof typeof PROMO_ITEMS;
