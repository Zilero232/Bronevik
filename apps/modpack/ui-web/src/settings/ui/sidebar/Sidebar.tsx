import clsx from 'clsx';

import type { StringKey } from '../../../shared/i18n/i18n.types';
import type { SidebarProps } from './Sidebar.types';

import { toggleSwitch } from '../../model/actions/actions';
import { useT } from '../../model/hooks/use-t/use-t';
import { openComponent, openSection } from '../../model/store/store';
import { Toggle } from '../toggle/Toggle';

const GROUP_TITLES: Record<string, StringKey> = { data: 'groupData', hangar: 'groupHangar', battle: 'groupBattle' };

export const Sidebar = ({ groups, view, selectedId }: SidebarProps) => {
  const t = useT();

  return (
    <nav className='sidebar'>
      <div className='sidebar__scroll'>
        {groups.map((group) => (
          <section key={group.id} className='sidebar__group'>
            <h3 className='sidebar__group-title'>{t(GROUP_TITLES[group.id] ?? 'groupOther')}</h3>
            {group.components.map((component) => (
              <div key={component.id} className={clsx('nav-item', view.section === 'components' && selectedId === component.id && 'nav-item--on')}>
                <button className='nav-item__title' type='button' onClick={() => openComponent(component.id)}>
                  {component.title}
                </button>
                {component.switch && <Toggle label={component.title} on={component.switch.value} onToggle={() => toggleSwitch(component)} />}
              </div>
            ))}
          </section>
        ))}
      </div>
      <div className='sidebar__footer'>
        <button className={clsx('nav-link', view.section === 'profiles' && 'nav-link--on')} type='button' onClick={() => openSection('profiles')}>
          {t('sectionProfiles')}
        </button>
        <button className={clsx('nav-link', view.section === 'hud' && 'nav-link--on')} type='button' onClick={() => openSection('hud')}>
          {t('sectionHud')}
        </button>
      </div>
    </nav>
  );
};
