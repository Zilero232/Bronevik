'use client';

import { Network } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TankLink } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader } from '@/ui-kit';

import { useTank } from '../../../model/context';
import { useSimilarTanks } from '../../../model/hooks';

import s from './SimilarTanks.module.scss';

export const SimilarTanks = () => {
  const t = useTranslations('tank.similar');
  const { tankId, identity } = useTank();
  const vehicles = useSimilarTanks();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.treeTank({ nation: identity.nation, tankId })}>
            <Network aria-hidden size={14} />
            {t('tree')}
          </Link>
        }
        title={t('title')}
      />
      {vehicles.length > 0 ? (
        <ul className={s.list}>
          {vehicles.map((vehicle) => (
            <li key={vehicle.tankId}>
              <TankLink vehicle={vehicle} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={s.empty}>{t('empty')}</p>
      )}
    </Card>
  );
};
