import type { TelegramLinkHeaderProps } from './TelegramLinkHeader.types';

import s from './TelegramLinkHeader.module.scss';

export const TelegramLinkHeader = ({ title, description }: TelegramLinkHeaderProps) => (
  <header className={s.root}>
    <h1 className={s.title}>{title}</h1>
    <p className={s.description}>{description}</p>
  </header>
);
