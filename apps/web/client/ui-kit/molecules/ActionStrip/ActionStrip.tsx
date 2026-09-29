import { clsx } from 'clsx';

import { Link } from '@/shared/i18n/navigation';

import type { ActionStripProps } from './ActionStrip.types';

import s from './ActionStrip.module.scss';

export const ActionStrip = ({
  as: Tag = 'div',
  links,
  start,
  end,
  align = 'center',
  variant = 'chips',
  className,
  innerClassName,
  children,
  ...props
}: ActionStripProps) => (
  <Tag className={clsx(s.root, s[variant], className)} {...props}>
    <div className={clsx(s.inner, s[align], innerClassName)}>
      {links && links.length > 0 && (
        <ul className={s.links}>
          {links.map(({ id, href, label, icon, hint, tone }) => (
            <li key={id}>
              <Link className={s.link} data-tone={tone} href={href}>
                <span aria-hidden className={s.icon}>
                  {icon}
                </span>
                <span className={s.text}>
                  <span className={s.label}>{label}</span>
                  {hint && variant === 'tiles' && <span className={s.hint}>{hint}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {start && <div className={s.start}>{start}</div>}
      {children}
      {end && <div className={s.end}>{end}</div>}
    </div>
  </Tag>
);
