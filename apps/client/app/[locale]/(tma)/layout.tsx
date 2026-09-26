import { MiniAppFooter } from '@/views/mini-app';

import s from './layout.module.scss';

const MiniAppLayout = ({ children }: LayoutProps<'/[locale]'>) => (
  <div className={s.root} data-theme='dark'>
    <div className={s.column}>
      <main className={s.main}>{children}</main>
      <MiniAppFooter />
    </div>
  </div>
);

export default MiniAppLayout;
