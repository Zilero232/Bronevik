import clsx from 'clsx';

import type { HudEditorProps } from './HudEditor.types';

import { useHudEditor } from '../../model/hooks/use-hud-editor/use-hud-editor';
import { useT } from '../../model/hooks/use-t/use-t';

const percent = (value: number, extent: number): string => `${(value / Math.max(extent, 1)) * 100}%`;

export const HudEditor = ({ panels }: HudEditorProps) => {
  const t = useT();
  const editor = useHudEditor(panels);

  return (
    <article className='card'>
      <header className='card__head'>
        <div className='card__titles'>
          <h2 className='section-title'>{t('sectionHud')}</h2>
          <p className='card__hint'>{t('hudHint')}</p>
        </div>
        <button className='button button--accent' disabled={panels.length === 0} type='button' onClick={editor.editOnScreen}>
          {t('hudOnScreen')}
        </button>
      </header>
      {panels.length === 0 ? (
        <p className='empty'>{t('hudEmpty')}</p>
      ) : (
        <div ref={editor.stageRef} className='stage'>
          {editor.placed.map(({ panel, rect }) => (
            <div
              key={panel.id}
              style={{
                left: percent(rect.left, editor.screen.width),
                top: percent(rect.top, editor.screen.height),
                width: percent(rect.width, editor.screen.width),
                height: percent(rect.height, editor.screen.height)
              }}
              aria-label={panel.title}
              className={clsx('stage__panel', editor.selected === panel.id && 'stage__panel--on', !panel.enabled && 'stage__panel--off')}
              role='button'
              tabIndex={0}
              onKeyDown={(event) => editor.nudge({ id: panel.id, key: event.key })}
              onMouseDown={(event) => editor.startDrag({ id: panel.id, mouseX: event.clientX, mouseY: event.clientY })}
            >
              <span className='stage__panel-title'>{panel.title}</span>
              <span className='stage__panel-preview'>{panel.enabled ? (panel.preview ?? '') : t('hudDisabled')}</span>
            </div>
          ))}
        </div>
      )}
      {editor.selected && (
        <div className='card__actions'>
          <button className='button' type='button' onClick={() => editor.selected && editor.reset(editor.selected)}>
            {t('hudReset')}
          </button>
        </div>
      )}
    </article>
  );
};
