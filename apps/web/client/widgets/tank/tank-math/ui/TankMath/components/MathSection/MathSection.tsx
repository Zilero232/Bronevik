import type { MathSectionProps } from './MathSection.types';

import s from './MathSection.module.scss';

export const MathSection = ({ title, description, children }: MathSectionProps) => (
  <section className={s.root}>
    <header className={s.head}>
      <h3 className={s.title}>{title}</h3>
      <p className={s.description}>{description}</p>
    </header>
    {children}
  </section>
);
