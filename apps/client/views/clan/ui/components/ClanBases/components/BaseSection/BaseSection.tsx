import type { BaseSectionProps } from './BaseSection.types';

import s from './BaseSection.module.scss';

export const BaseSection = ({ title, note, isEmpty, children }: BaseSectionProps) => (
  <section className={s.root}>
    <h4 className={s.title}>{title}</h4>
    {isEmpty ? <p className={s.note}>{note}</p> : <ul className={s.list}>{children}</ul>}
  </section>
);
