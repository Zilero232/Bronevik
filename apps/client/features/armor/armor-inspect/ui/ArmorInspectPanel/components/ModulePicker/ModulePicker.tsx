'use client';

import { useTranslations } from 'next-intl';

import { Select } from '@/ui-kit';

import { useArmorInspect } from '../../../../model/context';

import s from './ModulePicker.module.scss';

export const ModulePicker = () => {
  const t = useTranslations('armor.controls');
  const { modules, turret, gun, setTurret, setGun } = useArmorInspect();

  const guns = turret?.guns ?? [];

  return (
    <div className={s.root}>
      {modules.turrets.length > 1 && turret && (
        <Select
          items={modules.turrets.map(({ name, displayName }) => ({ value: name, label: displayName }))}
          label={t('turret')}
          value={turret.name}
          onValueChange={setTurret}
        />
      )}
      {guns.length > 1 && gun && (
        <Select
          items={guns.map(({ name, displayName }) => ({ value: name, label: displayName }))}
          label={t('gun')}
          value={gun.name}
          onValueChange={setGun}
        />
      )}
    </div>
  );
};
