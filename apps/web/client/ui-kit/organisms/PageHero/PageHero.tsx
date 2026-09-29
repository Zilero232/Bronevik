import { isNation } from '@otmetki/icons';
import { clsx } from 'clsx';

import type { PageHeroProps } from './PageHero.types';

import { Breadcrumbs } from '../../molecules';
import { BattleBackdrop } from '../BattleBackdrop';
import { HeroArt } from './components';

import s from './PageHero.module.scss';

export const PageHero = ({
  title,
  eyebrow,
  breadcrumbs,
  lead,
  art,
  figures,
  actions,
  backdrop = art?.kind === 'emblem' ? 'accent' : 'neutral',
  backdropSeed = 1,
  className
}: PageHeroProps) => (
  <header className={clsx(s.root, className)}>
    <span aria-hidden className={s.hexes} />
    {art && <HeroArt art={art} />}
    <span aria-hidden className={s.scrim} />
    {backdrop && (
      <BattleBackdrop
        className={s.backdrop}
        density='low'
        nation={art?.kind === 'flag' && isNation(art.nation) ? art.nation : undefined}
        seed={backdropSeed}
        tone={backdrop}
      />
    )}
    <div className={s.inner}>
      <div className={s.main}>
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs isCurrentAccent items={breadcrumbs} />}
        {eyebrow && <span className={s.eyebrow}>{eyebrow}</span>}
        <h1 className={s.title}>{title}</h1>
        {lead && <p className={s.lead}>{lead}</p>}
        {actions && <div className={s.actions}>{actions}</div>}
      </div>
      {figures && <div className={s.figures}>{figures}</div>}
    </div>
  </header>
);
