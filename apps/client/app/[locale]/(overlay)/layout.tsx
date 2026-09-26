import s from './layout.module.scss';

const OverlayLayout = ({ children }: LayoutProps<'/[locale]'>) => <main className={s.root}>{children}</main>;

export default OverlayLayout;
