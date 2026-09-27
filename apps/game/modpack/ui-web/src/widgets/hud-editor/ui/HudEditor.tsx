import type { HudEditorProps } from './HudEditor.types';

import { useT } from '../../../entities/window-state';
import { ActionBar } from '../../../shared/ui/action-bar';
import { Button } from '../../../shared/ui/button';
import { Card } from '../../../shared/ui/card';
import { Empty } from '../../../shared/ui/empty';
import { HUD_EDITOR } from '../config';
import { useHudEditor } from '../model/hooks';
import { HudPanel } from './components';

import s from './HudEditor.module.scss';

export const HudEditor = ({ panels }: HudEditorProps) => {
  const t = useT();
  const editor = useHudEditor(panels);

  return (
    <Card
      aside={
        <Button disabled={!editor.hasPanels} variant='accent' onClick={editor.editOnScreen}>
          {t('hudOnScreen')}
        </Button>
      }
      hint={t('hudHint')}
      title={t('sectionHud')}
    >
      {editor.hasPanels ? (
        <div ref={editor.stageRef} aria-label={t('hudStage')} className={s.stage} role='group'>
          {editor.panels.map((item) => (
            <HudPanel key={item.panel.id} item={item} />
          ))}
        </div>
      ) : (
        <Empty>{t('hudEmpty')}</Empty>
      )}
      {editor.hasSelection && <ActionBar items={[{ id: HUD_EDITOR.resetActionId, label: t('hudReset'), onClick: editor.resetSelected }]} />}
    </Card>
  );
};
