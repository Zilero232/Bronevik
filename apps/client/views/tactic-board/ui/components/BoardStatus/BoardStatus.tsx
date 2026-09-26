'use client';

import { Eye, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import { BOARD_STATUS_TONE } from '../../../config';
import { useBoardStatus } from '../../../model/hooks';

import s from './BoardStatus.module.scss';

export const BoardStatus = () => {
  const t = useTranslations('tactics.status');
  const { status, isReadOnly, peers } = useBoardStatus();

  return (
    <div className={s.root}>
      <div className={s.row}>
        <Badge tone={BOARD_STATUS_TONE[status]}>
          <span className={s.dot} data-status={status} />
          {t(status)}
        </Badge>
        {isReadOnly && (
          <Badge tone='neutral'>
            <Eye size={12} />
            {t('readOnly')}
          </Badge>
        )}
      </div>
      <div className={s.peers}>
        <Users size={14} />
        {peers.length === 0 ? (
          t('alone')
        ) : (
          <ul className={s.names}>
            {peers.map(({ clientId, name, color }) => (
              <li key={clientId} className={s.peer} style={{ color }}>
                {name ?? t('guest')}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
