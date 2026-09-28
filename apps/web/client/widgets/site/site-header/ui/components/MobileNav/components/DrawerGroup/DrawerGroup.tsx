'use client';

import { Accordion } from '@base-ui/react/accordion';
import { ChevronDown } from 'lucide-react';

import { Link } from '@/shared/i18n/navigation';

import type { DrawerGroupProps } from './DrawerGroup.types';

import s from '../../MobileNav.module.scss';

export const DrawerGroup = ({ value, label, links, activeHref, isActive, onNavigate }: DrawerGroupProps) => (
  <Accordion.Item className={s.group} value={value}>
    <Accordion.Header className={s.header}>
      <Accordion.Trigger className={s.trigger} data-active={isActive}>
        {label}
        <ChevronDown aria-hidden className={s.chevron} size={18} />
      </Accordion.Trigger>
    </Accordion.Header>
    <Accordion.Panel className={s.panel}>
      <ul className={s.links}>
        {links.map((link) => (
          <li key={link.key}>
            <Link
              aria-current={activeHref === link.href ? 'page' : undefined}
              className={s.link}
              data-active={activeHref === link.href}
              href={link.href}
              onClick={onNavigate}
            >
              <link.icon aria-hidden size={16} />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </Accordion.Panel>
  </Accordion.Item>
);
