import clsx from 'clsx';

import type { HudEditorProps } from './HudEditor.types';

import { useHudEditor } from '../../model/hooks/use-hud-editor';
import { useT } from '../../model/hooks/use-t';
import { Button } from '../button';
import { Card, CardAction, CardActions } from '../card';
import { Empty } from '../empty';

import s from './HudEditor.module.scss';

export const HudEditor = ({ panels }: HudEditorProps) => {
  const t = useT();
  const editor = useHudEditor(panels);

  return (
    <Card
      aside={
        <Button disabled={panels.length === 0} variant='accent' onClick={editor.editOnScreen}>
          {t('hudOnScreen')}
        </Button>
      }
      hint={t('hudHint')}
      title={t('sectionHud')}
    >
      {panels.length === 0 ? (
        <Empty>{t('hudEmpty')}</Empty>
      ) : (
        <div ref={editor.stageRef} className={s.stage}>
          {editor.placed.map(({ panel, box }) => (
            <div
              key={panel.id}
              aria-label={panel.title}
              className={clsx(s.panel, editor.selected === panel.id && s.panelOn, !panel.enabled && s.panelOff)}
              role='button'
              style={box}
              tabIndex={0}
              onKeyDown={(event) => editor.nudge({ id: panel.id, key: event.key })}
              onMouseDown={(event) => editor.startDrag({ id: panel.id, mouseX: event.clientX, mouseY: event.clientY })}
            >
              <span className={s.panelTitle}>{panel.title}</span>
              <span className={s.panelPreview}>{panel.enabled ? (panel.preview ?? '') : t('hudDisabled')}</span>
            </div>
          ))}
        </div>
      )}
      {editor.selected && (
        <CardActions>
          <CardAction onClick={() => editor.selected && editor.reset(editor.selected)}>{t('hudReset')}</CardAction>
        </CardActions>
      )}
    </Card>
  );
};
