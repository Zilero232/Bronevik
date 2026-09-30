import { RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, SectionHeader } from '@/ui-kit';

import { MOD_INSTALL_PRESETS, MOD_INSTALL_STEPS, MOD_PAGE } from '../../../config';
import { ModBind } from './components';

import s from './ModInstall.module.scss';

export const ModInstall = () => {
  const t = useTranslations('mod.install');

  return (
    <section className={s.root}>
      <SectionHeader description={t('lead')} title={t('title')} variant='display' />
      <ol className={s.steps}>
        {MOD_INSTALL_STEPS.map(({ id, icon: Icon }, index) => (
          <li key={id} className={s.step}>
            <span className={s.head}>
              <span aria-hidden className={s.number}>
                {index + 1}
              </span>
              <Icon aria-hidden className={s.icon} size={MOD_PAGE.featureIconSize} />
            </span>
            <h3 className={s.title}>{t(`steps.${id}.title`)}</h3>
            <p className={s.text}>{t(`steps.${id}.text`)}</p>
            {id === 'pick' && (
              <ul className={s.presets}>
                {MOD_INSTALL_PRESETS.map((preset) => (
                  <li key={preset}>
                    <Badge tone='neutral'>{t(`presets.${preset}`)}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
      <p className={s.restart}>
        <RotateCcw aria-hidden className={s.restartIcon} size={MOD_PAGE.iconSize} />
        {t('restart')}
      </p>
      <ModBind />
    </section>
  );
};
