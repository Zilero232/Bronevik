import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { Skeleton } from '@/ui-kit';

import type { PaletteStatusProps } from './PaletteStatus.types';

import s from './PaletteStatus.module.scss';

const SKELETON_ROWS = [72, 54, 64] as const;

export const PaletteStatus = ({ total, isEnabled, isFetching, isError }: PaletteStatusProps) => {
  const t = useTranslations('search');

  return match({ total, isEnabled, isFetching, isError })
    .with({ isEnabled: false }, () => <p className={s.hint}>{t('hint')}</p>)
    .with({ isError: true }, () => <p className={s.error}>{t('error')}</p>)
    .with({ isFetching: true, total: 0 }, () => (
      <Command.Loading className={s.loading} label={t('loading')}>
        {SKELETON_ROWS.map((width) => (
          <span key={width} className={s.row}>
            <Skeleton height={32} shape='block' width={32} />
            <Skeleton width={`${width}%`} />
          </span>
        ))}
      </Command.Loading>
    ))
    .with({ total: 0 }, () => <p className={s.hint}>{t('empty')}</p>)
    .otherwise(() => null);
};
