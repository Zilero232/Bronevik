import { getTranslations } from 'next-intl/server';
import { Suspense, ViewTransition } from 'react';

import { LestaNoticeProvider } from '@/entities/app/lesta-notice';
import { readLestaNotice } from '@/entities/app/lesta-notice/server';
import { PAGE_TRANSITION } from '@/shared/i18n/navigation';
import { CompareTray } from '@/widgets/compare/compare-tray';
import { DataNotice } from '@/widgets/site/data-notice';
import { SiteFooter } from '@/widgets/site/site-footer';
import { SiteHeader } from '@/widgets/site/site-header';
import { SiteTabBar } from '@/widgets/site/tab-bar';

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
          <ViewTransition default='none' update={{ [PAGE_TRANSITION.type]: PAGE_TRANSITION.className, default: 'none' }}>
            {children}
          </ViewTransition>
        </main>
        <SiteFooter />
        <CompareTray />
        <Suspense fallback={null}>
          <SiteTabBar />
        </Suspense>
      </div>
    </LestaNoticeProvider>
  );
};

export default SiteLayout;
