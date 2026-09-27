import { clsx } from 'clsx';

import type { SettingsCardProps } from './SettingsCard.types';

import s from './SettingsCard.module.scss';

export const SettingsCard = ({ icon, eyebrow, title, description, className, children }: SettingsCardProps) => (
  <section className={clsx(s.root, className)}>
    <header className={s.header}>
      <span aria-hidden className={s.icon}>
        {icon}
      </span>
      <div className={s.text}>
        <span className={s.eyebrow}>{eyebrow}</span>
        <h2 className={s.title}>{title}</h2>
        {description && <p className={s.description}>{description}</p>}
      </div>
    </header>
    {children}
  </section>
);
