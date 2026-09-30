import type { EditorStageProps } from './EditorStage.types';

import { HudSample } from '../../../../../../../entities/hud-widgets/registry';
import { useT } from '../../../../../../../entities/window-state';
import { ActionBar } from '../../../../../../../shared/ui/action-bar';
import { Button } from '../../../../../../../shared/ui/button';
import { Confirm } from '../../../../../../../shared/ui/confirm';
import { Icon } from '../../../../../../../shared/ui/icon';
import { Segmented } from '../../../../../../../shared/ui/segmented';

import s from './EditorStage.module.scss';

export const EditorStage = ({ component, model }: EditorStageProps) => {
  const t = useT();
  const { card, hint } = model;

  return (
    <div className={s.stage}>
      <div className={s.screen}>
        <span className={s.caption}>{t('preview')}</span>
        <Segmented className={s.zoom} items={model.zoomItems} label={t('editorZoom')} value={String(model.zoom)} onSelect={model.setZoom} />
        <div className={s.view}>
          {card.preview && (
            <div className={s.zoomed} style={{ transform: `scale(${model.zoom})` }}>
              <HudSample text={card.preview.text ?? card.preview.preview} widget={card.preview.widget} />
            </div>
          )}
        </div>
      </div>
      <div aria-live='polite' className={s.hint}>
        <span className={s.hintLabel}>{hint.label}</span>
        {hint.text && <span className={s.hintText}>{hint.text}</span>}
      </div>
      <div className={s.actions}>
        {component.panel && (
          <Button className={s.action} size='small' onClick={card.moveOnScreen}>
            {t('moveOnScreen')}
          </Button>
        )}
        <Button className={s.action} disabled={card.changedCount === 0} size='small' variant='ghost' onClick={card.reset}>
          <span className={s.reset}>
            <Icon className={s.resetIcon} name='rotate-ccw' size={14} tone={card.changedCount === 0 ? 'muted' : 'accent'} />
            {t('resetDefaults')}
          </span>
        </Button>
      </div>
      {card.actionItems.length > 0 && <ActionBar items={card.actionItems} />}
      {card.confirmText !== null && (
        <Confirm cancelLabel={t('cancel')} confirmLabel={t('confirm')} text={card.confirmText} onCancel={card.cancel} onConfirm={card.confirm} />
      )}
    </div>
  );
};
