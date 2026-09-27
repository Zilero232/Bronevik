import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { RetryButton, Skeleton } from '@/ui-kit';

import type { PaletteStatusProps } from './PaletteStatus.types';

import { COMMAND_PALETTE } from '../../../config';

import s from './PaletteStatus.module.scss';

export const PaletteStatus = ({ total, isEnabled, isFetching, isError, onRetry }: PaletteStatusProps) => {
  const t = useTranslations('search');

  return match({ total, isEnabled, isFetching, isError })
    .with({ isEnabled: false }, () => <p className={s.hint}>{t('hint')}</p>)
    .with({ isError: true }, () => (
      <div className={s.failure}>
        <p className={s.error}>{t('error')}</p>
        <RetryButton disabled={isFetching} size='sm' variant='ghost' onClick={onRetry} />
      </div>
    ))
    .with({ isFetching: true, total: 0 }, () => (
      <Command.Loading className={s.loading} label={t('loading')}>
        {COMMAND_PALETTE.skeletonWidths.map((width) => (
          <span key={width} className={s.row}>
            <Skeleton height={COMMAND_PALETTE.skeletonIcon} shape='block' width={COMMAND_PALETTE.skeletonIcon} />
            <Skeleton width={`${width}%`} />
          </span>
        ))}
      </Command.Loading>
    ))
    .with({ total: 0 }, () => <p className={s.hint}>{t('empty')}</p>)
    .otherwise(() => null);
};
