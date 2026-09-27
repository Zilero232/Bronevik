import { useStore } from '@nanostores/preact';
import clsx from 'clsx';

import { useBridge } from '../../model/hooks/use-bridge';
import { useT } from '../../model/hooks/use-t';
import { $groups, $invalid, $selected, $state, $view } from '../../model/store';
import { ComponentView } from '../component-view';
import { Header } from '../header';
import { HudEditor } from '../hud-editor';
import { Notice } from '../notice';
import { Profiles } from '../profiles';
import { Sidebar } from '../sidebar';

import s from './App.module.scss';

export const App = () => {
  useBridge();

  const t = useT();
  const state = useStore($state);
  const view = useStore($view);
  const groups = useStore($groups);
  const selected = useStore($selected);
  const invalid = useStore($invalid);

  if (!state) {
    return <div className={clsx(s.window, s.empty)}>{invalid ? t('invalidState') : t('loading')}</div>;
  }

  return (
    <div className={s.window}>
      <Header state={state} />
      <div className={s.body}>
        <Sidebar groups={groups} selectedId={selected?.id ?? null} view={view} />
        <main className={s.content}>
          {view.section === 'components' && selected && <ComponentView key={selected.id} component={selected} />}
          {view.section === 'profiles' && <Profiles profiles={state.profiles} />}
          {view.section === 'hud' && <HudEditor panels={state.hud.panels} />}
        </main>
      </div>
      {state.notice && <Notice key={state.revision} notice={state.notice} />}
    </div>
  );
};
