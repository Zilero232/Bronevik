import { SiteFooter } from '@/widgets/site/site-footer';
import { SiteHeader } from '@/widgets/site/site-header';

import s from './layout.module.scss';

const SiteLayout = ({ children }: LayoutProps<'/[locale]'>) => (
  <div className={s.root}>
    <SiteHeader />
    <main className={s.main}>{children}</main>
    <SiteFooter />
  </div>
);

export default SiteLayout;
