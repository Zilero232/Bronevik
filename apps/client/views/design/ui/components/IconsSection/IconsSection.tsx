'use client';

import {
  AnimatedCrosshair,
  AnimatedLogo,
  AnimatedMarkOfExcellence,
  AnimatedMastery,
  ICON_GROUPS,
  ICONS,
  MarkOfExcellenceIcon,
  MasteryIcon,
  NATION_ICONS,
  NATIONS,
  TANK_CLASS_ICONS,
  TANK_CLASSES,
  TierIcon,
  TIERS
} from '@bronevik/icons';
import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { TankImage } from '@/entities/tank/tank';
import { useVehicleCatalog } from '@/features/tank/pick-tank';
import { Button, Card, SegmentedControl, Skeleton } from '@/ui-kit';

import { DesignBlock, DesignRow } from '../DesignBlock';
import { CLASS_VARIANTS, ICON_GROUP_ORDER, ICON_SIZES, ICON_STROKES, MARK_COUNTS, MASTERY_LEVELS, RENDER_SAMPLES } from './IconsSection.constants';
import { renderSamples } from './IconsSection.helpers';

import s from './IconsSection.module.scss';

export const IconsSection = () => {
  const t = useTranslations('design.icons');
  const [size, setSize] = useState<(typeof ICON_SIZES)[number]>('32');
  const [stroke, setStroke] = useState<(typeof ICON_STROKES)[number]>('1.75');
  const [replay, setReplay] = useState(0);
  const catalog = useVehicleCatalog();

  const samples = renderSamples(catalog.data ?? []);
  const iconProps = { size: Number(size), strokeWidth: Number(stroke) };

  const controls = (
    <div className={s.controls}>
      <SegmentedControl
        aria-label={t('size')}
        options={ICON_SIZES.map((value) => ({ value, label: value }))}
        size='sm'
        value={size}
        onChange={setSize}
      />
      <SegmentedControl
        aria-label={t('stroke')}
        options={ICON_STROKES.map((value) => ({ value, label: value }))}
        size='sm'
        value={stroke}
        onChange={setStroke}
      />
    </div>
  );

  return (
    <DesignBlock action={controls} eyebrow='03' id='icons' title={t('title')}>
      {ICON_GROUP_ORDER.map((group) => (
        <DesignRow key={group} label={t(`groups.${group}`)}>
          {ICON_GROUPS[group].map((name) => {
            const Icon = ICONS[name];

            return (
              <span key={name} className={s.cell} title={name}>
                <Icon {...iconProps} />
                <code className={s.name}>{name}</code>
              </span>
            );
          })}
        </DesignRow>
      ))}
      {CLASS_VARIANTS.map((variant) => (
        <DesignRow key={variant} label={t(`variants.${variant}`)}>
          {TANK_CLASSES.map((tankClass) => {
            const Icon = TANK_CLASS_ICONS[tankClass];

            return (
              <span key={tankClass} className={s.cell} title={`${tankClass} · ${variant}`}>
                <Icon size={Number(size)} variant={variant} />
              </span>
            );
          })}
        </DesignRow>
      ))}
      <DesignRow label={t('groups.nationsColor')}>
        {NATIONS.map((nation) => {
          const Icon = NATION_ICONS[nation];

          return (
            <span key={nation} className={s.cell} title={nation}>
              <Icon palette='color' {...iconProps} />
              <code className={s.name}>{nation}</code>
            </span>
          );
        })}
      </DesignRow>
      <DesignRow label={t('groups.masteryTinted')}>
        {MASTERY_LEVELS.map((level) => (
          <span key={level} className={s.cell} title={level}>
            <MasteryIcon tinted level={level} {...iconProps} />
          </span>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.marksRings')}>
        {MARK_COUNTS.map((marks) => (
          <span key={marks} className={s.cell}>
            <MarkOfExcellenceIcon marks={marks} markStyle='rings' {...iconProps} />
          </span>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.tiers')}>
        {TIERS.map((tier) => (
          <span key={tier} className={s.cell}>
            <TierIcon {...iconProps} tier={tier} />
          </span>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.tiersEngraved')}>
        {TIERS.map((tier) => (
          <span key={tier} className={s.cell}>
            <TierIcon engraved {...iconProps} tier={tier} />
          </span>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.renders')}>
        {catalog.isLoading &&
          RENDER_SAMPLES.map(({ key }) => (
            <span key={key} className={s.render}>
              <Skeleton height={96} shape='block' width={160} />
              <code className={s.name}>{key}</code>
            </span>
          ))}
        {catalog.isError && (
          <>
            <span className={s.name}>{t('rendersError')}</span>
            <Button size='sm' variant='secondary' onClick={() => catalog.refetch()}>
              <RotateCcw size={14} />
              {t('retry')}
            </Button>
          </>
        )}
        {catalog.isSuccess && samples.length === 0 && <span className={s.name}>{t('rendersEmpty')}</span>}
        {samples.map(({ key, size: renderSize, tank }) => (
          <span key={key} className={s.render}>
            <TankImage size={renderSize} tank={tank} />
            <code className={s.name}>{key}</code>
          </span>
        ))}
      </DesignRow>
      <DesignRow label={t('groups.surfaces')}>
        <Card className={s.surface} variant='riveted'>
          <span className={s.name}>{t('riveted')}</span>
        </Card>
        <span className={s.divider} />
      </DesignRow>
      <DesignRow label={t('groups.animated')}>
        <div key={replay} className={s.animated}>
          <AnimatedLogo size={64} strokeWidth={1.5} />
          <AnimatedMarkOfExcellence marks={3} size={64} strokeWidth={1.5} />
          <AnimatedMastery tinted level='master' size={64} strokeWidth={1.5} />
          <AnimatedMastery tinted level='first' size={64} strokeWidth={1.5} />
          <AnimatedCrosshair size={64} strokeWidth={1.5} />
        </div>
        <Button size='sm' variant='secondary' onClick={() => setReplay((current) => current + 1)}>
          <RotateCcw size={14} />
          {t('replay')}
        </Button>
      </DesignRow>
    </DesignBlock>
  );
};
