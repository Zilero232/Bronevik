import { useTranslations } from 'next-intl';

import { Badge, SectionHeader } from '@/ui-kit';

import { MOD_SWITCHES, MOD_TUNABLES } from '../../../config';

import s from './ModSwitches.module.scss';

export const ModSwitches = () => {
  const t = useTranslations('mod.switches');

  return (
    <section className={s.root}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <dl className={s.list}>
        {MOD_SWITCHES.map(({ id, setting }) => (
          <div key={id} className={s.row}>
            <dt className={s.term}>
              <span className={s.name}>{t(`items.${id}.title`)}</span>
              <code className={s.key}>{setting}</code>
            </dt>
            <dd className={s.description}>{t(`items.${id}.text`)}</dd>
            <dd className={s.value}>
              <Badge tone='neutral'>{t('on')}</Badge>
            </dd>
          </div>
        ))}
        {MOD_TUNABLES.map(({ id, setting, value }) => (
          <div key={id} className={s.row}>
            <dt className={s.term}>
              <span className={s.name}>{t(`tunables.${id}.title`)}</span>
              <code className={s.key}>{setting}</code>
            </dt>
            <dd className={s.description}>{t(`tunables.${id}.text`)}</dd>
            <dd className={s.value}>
              <Badge tone='neutral'>{t(`tunables.${id}.value`, { value })}</Badge>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
