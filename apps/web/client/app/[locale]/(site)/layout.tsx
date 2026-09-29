import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

import { LestaNoticeProvider } from '@/entities/app/lesta-notice';
import { readLestaNotice } from '@/entities/app/lesta-notice/server';
import { DataNotice } from '@/widgets/site/data-notice';
import { SiteFooter } from '@/widgets/site/site-footer';
import { SiteHeader } from '@/widgets/site/site-header';

import s from './layout.module.scss';

const SiteLayout = async ({ children }: Pick<LayoutProps<'/[locale]'>, 'children'>) => {
  const t = await getTranslations('nav');

  return (
    <LestaNoticeProvider isShown={readLestaNotice()}>
      <div className={s.root}>
        <a className={s.skip} href='#main'>
          {t('skipToContent')}
        </a>
        <Suspense fallback={null}>
          <DataNotice />
        </Suspense>
        <SiteHeader />
        <main className={s.main} id='main' tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </div>
    </LestaNoticeProvider>
  );
};

export default SiteLayout;
