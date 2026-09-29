import { ChevronDown } from 'lucide-react';

import type { FaqListProps } from './FaqList.types';

import s from './FaqList.module.scss';

export const FaqList = ({ items }: FaqListProps) => (
  <div className={s.root}>
    {items.map(({ id, question, answer }) => (
      <details key={id} className={s.item}>
        <summary className={s.question}>
          {question}
          <ChevronDown aria-hidden className={s.chevron} size={16} />
        </summary>
        <p className={s.answer}>{answer}</p>
      </details>
    ))}
  </div>
);
