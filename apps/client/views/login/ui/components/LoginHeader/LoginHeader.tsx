import type { LoginHeaderProps } from './LoginHeader.types';

import s from './LoginHeader.module.scss';

export const LoginHeader = ({ title, description }: LoginHeaderProps) => (
  <header className={s.root}>
    <h1 className={s.title}>{title}</h1>
    <p className={s.description}>{description}</p>
  </header>
);
