'use client';

import { Crown, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { EmptyState, SectionHeader } from '@/ui-kit';

import type { PremiumStripProps } from './PremiumStrip.types';

import s from './PremiumStrip.module.scss';

export const PremiumStrip = ({ premiums }: PremiumStripProps) => {
  const t = useTranslations('tree.premiums');

  return (
    <section>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} title={t('title')} />
      {premiums.length === 0 ? (
        <EmptyState description={t('emptyDescription')} icon={<Gem size={26} />} title={t('emptyTitle')} />
      ) : (
        <motion.ul className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
          {premiums.map(({ vehicle }) => (
            <motion.li key={vehicle.tankId} variants={STAGGER_ITEM}>
              <Link className={s.card} href={ROUTES.tank(vehicle.slug)}>
                <Crown aria-hidden className={s.crown} size={16} />
                <TankImage isDecorative className={s.render} size='big' tank={vehicleIdentity(vehicle)} />
                <TankIdentity size='lg' tank={vehicleIdentity(vehicle)} withNation={false} />
                <span className={s.more}>{t('open')}</span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </section>
  );
};
