import clsx from 'clsx';

import type { SidebarProps } from './Sidebar.types';

import { SIDEBAR } from '../../config';
import { toggleSwitch } from '../../model/actions';
import { useT } from '../../model/hooks/use-t';
import { openComponent, openSection } from '../../model/store';
import { Toggle } from '../toggle';

import s from './Sidebar.module.scss';

export const Sidebar = ({ groups, view, selectedId }: SidebarProps) => {
  const t = useT();

  return (
    <nav className={s.sidebar}>
      <div className={s.scroll}>
        {groups.map((group) => (
          <section key={group.id} className={s.group}>
            <h3 className={s.groupTitle}>{t(SIDEBAR.groupTitles[group.id] ?? SIDEBAR.otherGroupTitle)}</h3>
            {group.components.map((component) => (
              <div key={component.id} className={clsx(s.item, view.section === 'components' && selectedId === component.id && s.itemOn)}>
                <button className={s.itemTitle} type='button' onClick={() => openComponent(component.id)}>
                  {component.title}
                </button>
                {component.switch && <Toggle label={component.title} on={component.switch.value} onToggle={() => toggleSwitch(component)} />}
              </div>
            ))}
          </section>
        ))}
      </div>
      <div className={s.footer}>
        <button className={clsx(s.link, view.section === 'profiles' && s.linkOn)} type='button' onClick={() => openSection('profiles')}>
          {t('sectionProfiles')}
        </button>
        <button className={clsx(s.link, view.section === 'hud' && s.linkOn)} type='button' onClick={() => openSection('hud')}>
          {t('sectionHud')}
        </button>
      </div>
    </nav>
  );
};
