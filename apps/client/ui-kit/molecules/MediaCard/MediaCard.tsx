import { clsx } from 'clsx';

import { Link } from '@/shared/i18n/navigation';

import type { MediaCardProps } from './MediaCard.types';

import s from './MediaCard.module.scss';

export const MediaCard = ({ href, media, title, sub, subIcon, ribbon, aspect = 'portrait', className }: MediaCardProps) => {
  const body = (
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
    </>
  );

  return href ? (
    <Link className={clsx(s.root, s[aspect], s.link, className)} href={href}>
      {body}
    </Link>
  ) : (
    <article className={clsx(s.root, s[aspect], className)}>{body}</article>
  );
};
