import { getTranslations } from 'next-intl/server';

import { LESTA_NOTICE } from '@/shared/config';
import { DataNotice } from '@/widgets/site/data-notice';
import { SiteFooter } from '@/widgets/site/site-footer';
import { SiteHeader } from '@/widgets/site/site-header';

import s from './layout.module.scss';

const SiteLayout = async ({ children }: Pick<LayoutProps<'/[locale]'>, 'children'>) => {
  const t = await getTranslations('nav');

  return (
    <div className={s.root}>
      <a className={s.skip} href='#main'>
        {t('skipToContent')}
      </a>
      {LESTA_NOTICE.isEnabled && <DataNotice />}
      <SiteHeader />
      <main className={s.main} id='main' tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
