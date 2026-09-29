import type { MethodBlockProps } from './MethodBlock.types';

import s from './MethodBlock.module.scss';

export const MethodBlock = ({ id, title, lead, children }: MethodBlockProps) => (
  <section aria-labelledby={`${id}-title`} className={s.root} id={id}>
    <h2 className={s.title} id={`${id}-title`}>
      {title}
    </h2>
    <p className={s.lead}>{lead}</p>
    {children}
  </section>
);
