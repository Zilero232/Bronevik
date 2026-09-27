import { clsx } from 'clsx';

import { Link } from '@/shared/i18n/navigation';

import type { MediaCardProps } from './MediaCard.types';

import s from './MediaCard.module.scss';

export const MediaCard = ({ href, isExternal = false, media, title, sub, subIcon, body, ribbon, aspect = 'portrait', className }: MediaCardProps) => {
  const classes = clsx(s.root, body ? s.stacked : s[aspect], href && s.link, className);
  const content = (
    <>
      <span className={s.media}>{media}</span>
      {ribbon}
      <span className={s.plate}>
        <span className={s.title}>{title}</span>
        {sub && (
          <span className={s.sub}>
            {subIcon && (
              <span aria-hidden className={s.subIcon}>
                {subIcon}
              </span>
            )}
            {sub}
          </span>
        )}
      </span>
      {body && <span className={s.body}>{body}</span>}
    </>
  );

  if (href && isExternal) {
    return (
      <a className={classes} href={href} rel='noopener noreferrer' target='_blank'>
        {content}
      </a>
    );
  }

  return href ? (
    <Link className={classes} href={href}>
      {content}
    </Link>
  ) : (
    <article className={classes}>{content}</article>
  );
};
