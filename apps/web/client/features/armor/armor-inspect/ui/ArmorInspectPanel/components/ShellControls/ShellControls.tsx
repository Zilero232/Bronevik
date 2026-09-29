'use client';

import { toShellKind } from '@otmetki/gamedata';
import { useTranslations } from 'next-intl';

import { RangeSlider, SegmentedControl, Select } from '@/ui-kit';

import type { RandomnessKey } from '../../../../model/context';

import { ARMOR_INSPECT, SHELL_KIND_KEYS } from '../../../../config';
import { useArmorAttack } from '../../../../model/context';

import s from './ShellControls.module.scss';

export const ShellControls = () => {
  const t = useTranslations('armor');
  const { guns, gun, shellOption, shellState, distance, randomnessKey, isAttackerLoading, setGun, setShell, setDistance, setRandomness } =
    useArmorAttack();

  const shells = gun?.shells ?? [];

  return (
    <div aria-busy={isAttackerLoading} className={s.root}>
      {guns.length > 1 && gun && (
        <Select
          items={guns.map(({ name, displayName }) => ({ value: name, label: displayName }))}
          label={t('attack.gun')}
          value={gun.name}
          onValueChange={setGun}
        />
      )}
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
          <p className={s.empty}>{t(isAttackerLoading ? 'attack.loading' : 'controls.noShells')}</p>
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
          onChange={setRandomness}
        />
      </div>
    </div>
  );
};
