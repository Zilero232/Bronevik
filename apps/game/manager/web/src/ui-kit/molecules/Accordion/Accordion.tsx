import { Accordion as BaseAccordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';

import type { AccordionProps } from './Accordion.types';

import s from './Accordion.module.scss';

export const Accordion = ({ items }: AccordionProps) => (
  <BaseAccordion.Root className={s.root}>
    {items.map((item) => (
      <BaseAccordion.Item key={item.id} className={s.item} value={item.id}>
        <BaseAccordion.Header className={s.header}>
          <BaseAccordion.Trigger className={s.trigger}>
            {item.title}
            <ChevronDown aria-hidden className={s.chevron} />
          </BaseAccordion.Trigger>
        </BaseAccordion.Header>
        <BaseAccordion.Panel className={s.panel}>
          <div className={s.content}>{item.content}</div>
        </BaseAccordion.Panel>
      </BaseAccordion.Item>
    ))}
  </BaseAccordion.Root>
);
