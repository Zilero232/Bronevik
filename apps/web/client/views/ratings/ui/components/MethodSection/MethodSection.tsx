import type { MethodSectionProps } from './MethodSection.types';

import { MethodBlock } from '../MethodBlock';

import s from './MethodSection.module.scss';

export const MethodSection = ({ section: { id, title, lead, lines, notes } }: MethodSectionProps) => (
  <MethodBlock id={id} lead={lead} title={title}>
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
  </MethodBlock>
);
