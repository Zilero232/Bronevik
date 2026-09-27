import type { HeaderProps } from './Header.types';

import { BindForm, Brand, StatusChip, Tools } from './components';

import s from './Header.module.scss';

export const Header = ({ status, language }: HeaderProps) => (
  <header className={s.header}>
    <Brand />
    <StatusChip status={status} />
    {!status.bound && <BindForm />}
    <Tools language={language} />
  </header>
);
