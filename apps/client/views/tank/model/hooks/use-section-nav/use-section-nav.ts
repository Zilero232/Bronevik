'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import type { SectionNavId } from './use-section-nav.types';

import { SECTION_NAV, TANK_PAGE } from '../../../config';

export const useSectionNav = () => {
  const t = useTranslations('tank.nav');
  const [active, setActive] = useState<SectionNavId>(SECTION_NAV[0]);

  useEffect(() => {
    const targets = SECTION_NAV.flatMap((id) => {
      const element = document.getElementById(id);

      return element ? [element] : [];
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        const id = SECTION_NAV.find((key) => key === visible?.target.id);

        if (id) {
          setActive(id);
        }
      },
      { rootMargin: TANK_PAGE.navSpyMargin }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  const items = SECTION_NAV.map((id) => ({ id, label: t(id), href: `#${id}` }));

  return { items, active, onSelect: setActive };
};
