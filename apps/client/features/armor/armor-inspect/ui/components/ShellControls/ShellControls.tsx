'use client';

import { toShellKind } from '@bronevik/gamedata';
import { useTranslations } from 'next-intl';

import { RangeSlider, SegmentedControl } from '@/ui-kit';

import type { RandomnessKey } from './ShellControls.types';

import { ARMOR_INSPECT, SHELL_KIND_KEYS } from '../../../config';
import { useArmorInspect } from '../../../model/context';

import s from './ShellControls.module.scss';

export const ShellControls = () => {
  const t = useTranslations('armor');
  const { gun, shellOption, shellState, distance, randomness, setShell, setDistance, setRandomness } = useArmorInspect();

  const shells = gun?.shells ?? [];
  const randomnessKey: RandomnessKey = randomness === ARMOR_INSPECT.randomness.client ? 'client' : 'lesta';

  return (
    <div className={s.root}>
      <div className={s.field}>
        <span className={s.label}>{t('controls.shell')}</span>
        {shellOption ? (
          <SegmentedControl
            options={shells.map(({ name, kind, penetration, displayName }) => ({
              value: name,
              'aria-label': displayName,
              label: t('controls.shellOption', { kind: t(`kinds.${SHELL_KIND_KEYS[toShellKind(kind)]}`), penetration: penetration.at100m })
            }))}
            aria-label={t('controls.shell')}
            className={s.shells}
            size='sm'
            value={shellOption.name}
            onChange={setShell}
          />
        ) : (
          <p className={s.empty}>{t('controls.noShells')}</p>
        )}
      </div>
      <RangeSlider
        label={t('controls.distance')}
        max={ARMOR_INSPECT.distance.max}
        min={ARMOR_INSPECT.distance.min}
        step={ARMOR_INSPECT.distance.step}
        value={distance}
        valueLabel={t('controls.distanceValue', { distance, penetration: Math.round(shellState?.shell.penetration ?? 0) })}
        onValueChange={setDistance}
      />
      <div className={s.field}>
        <span className={s.label}>{t('controls.randomness')}</span>
        <SegmentedControl<RandomnessKey>
          options={[
            { value: 'lesta', label: t('controls.randomnessLesta') },
            { value: 'client', label: t('controls.randomnessClient') }
          ]}
          aria-label={t('controls.randomness')}
          size='sm'
          value={randomnessKey}
          onChange={(key) => setRandomness(ARMOR_INSPECT.randomness[key])}
        />
      </div>
    </div>
  );
};
