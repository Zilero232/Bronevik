import { ArrowRight, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { HOME_ICON, HOME_MODPACK } from '../../../config';
import { ModpackPreview } from './components';

import s from './ModpackPromo.module.scss';

export const ModpackPromo = () => {
  const t = useTranslations('home.modpack');

  return (
    <section aria-labelledby='home-modpack' className={s.root}>
      <div className={s.panel}>
        <div className={s.copy}>
          <p className={s.eyebrow}>{t('eyebrow')}</p>
          <h2 className={s.title} id='home-modpack'>
            {t('title')}
          </h2>
          <p className={s.lead}>{t('lead')}</p>
          <ul className={s.props}>
            {HOME_MODPACK.props.map(({ key, icon: Icon, tone }) => (
              <li key={key} className={s.prop} data-tone={tone}>
                <span aria-hidden className={s.icon}>
                  <Icon size={HOME_ICON.modpackProp} />
                </span>
                <span className={s.propText}>
                  <span className={s.propTitle}>{t(`props.${key}.title`)}</span>
                  <span className={s.propHint}>{t(`props.${key}.text`)}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className={s.actions}>
            <Link className={buttonVariants({ variant: 'primary', size: 'lg', shine: true })} href={HOME_MODPACK.href}>
              <Download aria-hidden size={HOME_ICON.modpack} />
              {t('download')}
            </Link>
            <Link className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={HOME_MODPACK.details}>
              {t('details')}
              <ArrowRight aria-hidden size={HOME_ICON.modpack} />
            </Link>
          </div>
          <p className={s.note}>{t('note')}</p>
        </div>
        <ModpackPreview />
      </div>
    </section>
  );
};
