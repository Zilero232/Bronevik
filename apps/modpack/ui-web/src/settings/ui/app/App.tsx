import { useStore } from '@nanostores/preact';

import { useBridge } from '../../model/hooks/use-bridge';
import { useT } from '../../model/hooks/use-t';
import { $groups, $invalid, $selected, $state, $view } from '../../model/store';
import { ComponentView } from '../component-view';
import { Header } from '../header';
import { HudEditor } from '../hud-editor';
import { Notice } from '../notice';
import { Profiles } from '../profiles';
import { Sidebar } from '../sidebar';

export const App = () => {
  useBridge();

  const t = useT();
  const state = useStore($state);
  const view = useStore($view);
  const groups = useStore($groups);
  const selected = useStore($selected);
  const invalid = useStore($invalid);

  if (!state) {
    return <div className='window window--empty'>{invalid ? t('invalidState') : t('loading')}</div>;
  }

  return (
    <div className='window'>
      <Header state={state} />
      <div className='window__body'>
        <Sidebar groups={groups} selectedId={selected?.id ?? null} view={view} />
        <main className='content'>
          {view.section === 'components' && selected && <ComponentView key={selected.id} component={selected} />}
          {view.section === 'profiles' && <Profiles profiles={state.profiles} />}
          {view.section === 'hud' && <HudEditor panels={state.hud.panels} />}
        </main>
      </div>
      {state.notice && <Notice key={state.revision} notice={state.notice} />}
    </div>
  );
};
