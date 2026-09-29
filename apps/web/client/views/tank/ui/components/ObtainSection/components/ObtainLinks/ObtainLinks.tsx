'use client';

import { useFormatter } from 'next-intl';

import type { ObtainLinksProps } from './ObtainLinks.types';

import { ObtainList } from '../ObtainList';

import s from './ObtainLinks.module.scss';

export const ObtainLinks = ({ title, items }: ObtainLinksProps) => {
  const format = useFormatter();

  return (
    <ObtainList
      rows={items.map(({ key, title: label, href, date }) => ({
        key,
        label: href ? (
          <a className={s.link} href={href} rel='noreferrer' target='_blank'>
            {label}
          </a>
        ) : (
          <span>{label}</span>
        ),
        value: format.dateTime(new Date(date), { dateStyle: 'medium' })
      }))}
      title={title}
    />
  );
};
