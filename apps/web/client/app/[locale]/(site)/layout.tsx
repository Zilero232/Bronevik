import { getTranslations } from 'next-intl/server';
import * as rootParams from 'next/root-params';

import { resolveLocale } from '@/shared/i18n';
import { SiteFooter } from '@/widgets/site/site-footer';
import { SiteHeader } from '@/widgets/site/site-header';

import s from './layout.module.scss';

const SiteLayout = async ({ children }: LayoutProps<'/[locale]'>) => {
  const locale = resolveLocale(await rootParams.locale());
  const t = await getTranslations({ locale, namespace: 'nav' });

  return (
    <div className={s.root}>
      <a className={s.skip} href='#main'>
        {t('skipToContent')}
      </a>
      <SiteHeader />
      <main className={s.main} id='main' tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
