import type { ReactNode } from 'react';

import s from './layout.module.scss';

const OverlayLayout = ({ children }: { children: ReactNode }) => <main className={s.root}>{children}</main>;

export default OverlayLayout;
