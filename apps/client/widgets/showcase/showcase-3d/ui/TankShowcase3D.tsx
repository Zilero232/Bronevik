'use client';

import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

import { Link } from '@/shared/i18n/navigation';
import { TankImage } from '@/ui-kit';

import type { TankShowcase3DProps } from './TankShowcase3D.types';

import { useTankShowcase } from '../model/hooks';
import { NamePlate } from './components';

import s from './TankShowcase3D.module.scss';

const ShowcaseCanvas = dynamic(() => import('./components/ShowcaseCanvas').then(({ ShowcaseCanvas: Component }) => Component), { ssr: false });

export const TankShowcase3D = ({ tank, tanks, armorHref, className }: TankShowcase3DProps) => {
  const t = useTranslations('showcase');
  const showcase = useTankShowcase({ tank, tanks });
  const { current } = showcase;

  return (
    <div ref={showcase.rootRef} className={clsx(s.root, className)} data-mode={showcase.canvasMode ?? 'flat'} {...showcase.dragHandlers}>
      {showcase.identity && (
        <div aria-hidden={!showcase.isFlatVisible} className={s.flat} data-hidden={!showcase.isFlatVisible}>
          <TankImage isPriority className={s.render} size='big' tank={showcase.identity} withTint={false} />
        </div>
      )}
      {current && showcase.canvasMode && (
        <div className={s.stage} data-stale={showcase.isFlatVisible}>
          <ShowcaseCanvas
            drag={showcase.drag}
            isActive={showcase.isActive}
            mode={showcase.canvasMode}
            slug={current.slug}
            onReady={showcase.onReady}
          />
        </div>
      )}
      {current && showcase.tanks.length > 1 && <NamePlate index={showcase.index} tanks={showcase.tanks} onSelect={showcase.onSelect} />}
      {armorHref && (
        <Link className={s.armor} href={armorHref}>
          <Shield aria-hidden size={14} />
          {t('armor')}
        </Link>
      )}
    </div>
  );
};
