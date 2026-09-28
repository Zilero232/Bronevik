import { clsx } from 'clsx';
import Image from 'next/image';

import { Link } from '@/shared/i18n/navigation';

import type { StoryCardProps } from './StoryCard.types';

import { STORY_CARD } from './StoryCard.constants';

import s from './StoryCard.module.scss';

export const StoryCard = ({
  title,
  href,
  isExternal = false,
  cover,
  glyph,
  tone = 'accent',
  chip,
  flag,
  meta,
  excerpt,
  footer,
  actions,
  variant = 'default',
  isPriority = false,
  className
}: StoryCardProps) => (
  <article className={clsx(s.root, s[variant], href && s.linked, className)} data-tone={tone}>
    <div className={s.cover} data-state={cover ? 'image' : 'fallback'}>
      {cover ? (
        <Image
          fill
          unoptimized
          alt=''
          className={s.image}
          fetchPriority={isPriority ? 'high' : undefined}
          loading={isPriority ? 'eager' : 'lazy'}
          referrerPolicy='no-referrer'
          sizes={STORY_CARD.sizes[variant]}
          src={cover}
        />
      ) : (
        <span aria-hidden className={s.glyph}>
          {glyph}
        </span>
      )}
      <span aria-hidden className={s.vignette} />
      {chip && <span className={s.chip}>{chip}</span>}
      {flag && <span className={s.flag}>{flag}</span>}
    </div>
    <div className={s.body}>
      {meta && <div className={s.meta}>{meta}</div>}
      <h3 className={s.title}>
        {href && isExternal && (
          <a className={s.link} href={href} rel='noopener noreferrer' target='_blank'>
            {title}
          </a>
        )}
        {href && !isExternal && (
          <Link className={s.link} href={href}>
            {title}
          </Link>
        )}
        {!href && title}
      </h3>
      {excerpt && <p className={s.excerpt}>{excerpt}</p>}
      {footer && <div className={s.footer}>{footer}</div>}
      {actions && <div className={s.actions}>{actions}</div>}
    </div>
  </article>
);
