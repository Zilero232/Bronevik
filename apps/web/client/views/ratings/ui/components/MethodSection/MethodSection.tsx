import type { MethodSectionProps } from './MethodSection.types';

import s from './MethodSection.module.scss';

export const MethodSection = ({ section: { id, title, lead, lines, notes } }: MethodSectionProps) => (
  <section aria-labelledby={`${id}-title`} className={s.root} id={id}>
    <h2 className={s.title} id={`${id}-title`}>
      {title}
    </h2>
    <p className={s.lead}>{lead}</p>
    <ol className={s.lines}>
      {lines.map((line) => (
        <li key={line}>
          <code className={s.formula}>{line}</code>
        </li>
      ))}
    </ol>
    <ul className={s.notes}>
      {notes.map((note) => (
        <li key={note}>{note}</li>
      ))}
    </ul>
  </section>
);
