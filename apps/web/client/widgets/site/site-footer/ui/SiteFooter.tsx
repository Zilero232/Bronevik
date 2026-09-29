import { FooterBand, FooterBottom, FooterSitemap } from './components';

import s from './SiteFooter.module.scss';

export const SiteFooter = () => (
  <footer className={s.root}>
    <div className={s.inner}>
      <FooterBand />
      <FooterSitemap />
      <FooterBottom />
    </div>
  </footer>
);
