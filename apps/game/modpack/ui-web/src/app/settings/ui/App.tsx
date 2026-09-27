import clsx from 'clsx';

import { SECTION, useT } from '../../../entities/window-state';
import { ComponentCard } from '../../../widgets/component-card';
import { Header } from '../../../widgets/header';
import { HudEditor } from '../../../widgets/hud-editor';
import { Notice } from '../../../widgets/notice';
import { Profiles } from '../../../widgets/profiles';
import { Sidebar } from '../../../widgets/sidebar';
import { useApp } from '../model/hooks';

import s from './App.module.scss';

export const App = () => {
  const t = useT();
  const { state, section, selected, placeholderKey } = useApp();

  if (!state) {
    return (
      <div aria-live='polite' className={clsx(s.window, s.empty)} role='status'>
        {t(placeholderKey)}
      </div>
    );
  }

  return (
    <div className={s.window}>
      <Header language={state.language} status={state.status} />
      <div className={s.body}>
        <Sidebar />
        <main className={s.content}>
          {section === SECTION.components && selected && <ComponentCard key={selected.id} component={selected} />}
          {section === SECTION.profiles && <Profiles profiles={state.profiles} />}
          {section === SECTION.hud && <HudEditor panels={state.hud.panels} />}
        </main>
      </div>
      {state.notice && <Notice key={state.revision} notice={state.notice} />}
    </div>
  );
};
