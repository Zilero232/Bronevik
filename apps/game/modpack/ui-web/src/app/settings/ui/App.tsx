import { useT } from '../../../entities/window-state';
import { Header } from '../../../widgets/header';
import { Notice } from '../../../widgets/notice';
import { Sidebar } from '../../../widgets/sidebar';
import { UndoToast } from '../../../widgets/undo-toast';
import { WindowFrame } from '../../../widgets/window-frame';
import { useApp } from '../model/hooks';
import { Content } from './components';

import s from './App.module.scss';

export const App = () => {
  const t = useT();
  const app = useApp();

  if (!app.state) {
    return (
      <div aria-live='polite' className={s.empty} role='status'>
        {t(app.placeholderKey)}
      </div>
    );
  }

  return (
    <WindowFrame frame={app.frame} label={t('title')}>
      <Header compact={app.compact} frame={app.frame} language={app.state.language} />
      <div className={s.body}>
        <Sidebar compact={app.compact} />
        <main className={s.content}>
          <Content columns={app.columns} editing={app.editing} searching={app.searching} section={app.section} state={app.state} />
        </main>
      </div>
      <UndoToast />
      {app.state.notice && <Notice key={app.state.revision} notice={app.state.notice} />}
    </WindowFrame>
  );
};
