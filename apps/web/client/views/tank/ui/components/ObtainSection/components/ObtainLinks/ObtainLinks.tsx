'use client';

import { useFormatter } from 'next-intl';

import type { ObtainLinksProps } from './ObtainLinks.types';

import s from './ObtainLinks.module.scss';

export const ObtainLinks = ({ title, items }: ObtainLinksProps) => {
  const format = useFormatter();

  return (
    <div className={s.root}>
      <h3 className={s.title}>{title}</h3>
      <ul className={s.list}>
        {items.map(({ key, title: label, href, date }) => (
          <li key={key} className={s.row}>
            {href ? (
              <a className={s.link} href={href} rel='noreferrer' target='_blank'>
                {label}
              </a>
            ) : (
              <span>{label}</span>
            )}
            <span className={s.value}>{format.dateTime(new Date(date), { dateStyle: 'medium' })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
