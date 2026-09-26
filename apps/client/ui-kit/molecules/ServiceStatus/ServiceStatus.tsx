import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { ServiceStatusProps } from './ServiceStatus.types';

import s from './ServiceStatus.module.scss';

export const ServiceStatus = ({ status, isLabelVisible = false, className }: ServiceStatusProps) => {
  const t = useTranslations('common.apiStatus');
  const label = t(status);

  return (
    <span className={clsx(s.root, className)} data-status={status} role='status' title={label}>
      <span aria-hidden className={s.dot} />
      <span className={isLabelVisible ? s.label : s.hidden}>{label}</span>
    </span>
  );
};
