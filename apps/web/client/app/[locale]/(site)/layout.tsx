import { getTranslations } from 'next-intl/server';

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
      <SiteHeader />
      <main className={s.main} id='main' tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
