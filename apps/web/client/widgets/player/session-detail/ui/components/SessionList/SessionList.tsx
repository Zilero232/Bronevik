import type { SessionListProps } from './SessionList.types';

import s from './SessionList.module.scss';

export const SessionList = ({ title, list: List, children }: SessionListProps) => (
  <section className={s.root}>
    <h4 className={s.heading}>{title}</h4>
    <List className={s.list}>{children}</List>
  </section>
);
