import type { MeCardProps } from './MeCard.types';

import s from './MeCard.module.scss';

export const MeCard = ({ icon, title, description, action, children }: MeCardProps) => (
  <section className={s.root}>
    <header className={s.header}>
      <span aria-hidden className={s.icon}>
        {icon}
      </span>
      <div className={s.text}>
        <h2 className={s.title}>{title}</h2>
        {description && <p className={s.description}>{description}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);
