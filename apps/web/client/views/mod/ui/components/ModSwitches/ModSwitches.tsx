import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { MOD_SWITCH_TONE, MOD_SWITCHES, MOD_TUNABLES } from '../../../config';
import { SwitchRow } from './components';

import s from './ModSwitches.module.scss';

export const ModSwitches = () => {
  const t = useTranslations('mod.switches');

  return (
    <section className={s.root}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <dl className={s.list}>
        {MOD_SWITCHES.map(({ id, setting, value }) => (
          <SwitchRow
            key={id}
            setting={setting}
            text={t(`items.${id}.text`)}
            title={t(`items.${id}.title`)}
            tone={MOD_SWITCH_TONE[value]}
            value={t(`values.${value}`)}
          />
        ))}
        {MOD_TUNABLES.map(({ id, setting, value }) => (
          <SwitchRow
            key={id}
            setting={setting}
            text={t(`tunables.${id}.text`)}
            title={t(`tunables.${id}.title`)}
            tone='neutral'
            value={t(`tunables.${id}.value`, { value })}
          />
        ))}
      </dl>
    </section>
  );
};
