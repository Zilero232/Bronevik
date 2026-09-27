import clsx from 'clsx';

import { useT } from '../../../entities/window-state';
import { useSidebar } from '../model/hooks';
import { SidebarItem } from './components';

import s from './Sidebar.module.scss';

export const Sidebar = () => {
  const t = useT();
  const sidebar = useSidebar();

  return (
    <nav aria-label={t('sectionComponents')} className={s.sidebar}>
      <div className={s.scroll}>
        {sidebar.groups.map((group) => (
          <section key={group.id} aria-label={t(group.titleKey)} className={s.group}>
            <h3 className={s.groupTitle}>{t(group.titleKey)}</h3>
            {group.items.map((item) => (
              <SidebarItem key={item.component.id} item={item} />
            ))}
          </section>
        ))}
      </div>
      <div className={s.footer}>
        {sidebar.links.map((link) => (
          <button
            key={link.section}
            aria-current={link.active ? 'page' : undefined}
            className={clsx(s.link, link.active && s.linkOn)}
            type='button'
            onClick={link.open}
          >
            {t(link.label)}
          </button>
        ))}
      </div>
    </nav>
  );
};
