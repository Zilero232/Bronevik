'use client';

import { useTranslations } from 'next-intl';

import type { RoleCellProps } from './RoleCell.types';

import s from './RoleCell.module.scss';

export const RoleCell = ({ role }: RoleCellProps) => {
  const t = useTranslations('clans.roster.roles');

  return (
    <span className={s.root} data-role={role}>
      {t(role)}
    </span>
  );
};
