'use client';

import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { RoleCellProps } from './RoleCell.types';

import s from './RoleCell.module.scss';

export const RoleCell = ({ role, isOfficer }: RoleCellProps) => {
  const t = useTranslations('clans.roster.roles');

  return (
    <span className={s.root} data-officer={isOfficer}>
      {isOfficer && <Shield aria-hidden className={s.icon} size={14} />}
      {t(role)}
    </span>
  );
};
