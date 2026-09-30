import type { CardBodyProps } from './CardBody.types';

import { useT } from '../../../../../entities/window-state';
import { ActionBar } from '../../../../../shared/ui/action-bar';
import { Button } from '../../../../../shared/ui/button';
import { Confirm } from '../../../../../shared/ui/confirm';
import { Empty } from '../../../../../shared/ui/empty';
import { Icon } from '../../../../../shared/ui/icon';
import { AdvancedFields } from '../AdvancedFields';
import { CardPreview } from '../CardPreview';
import { Field } from '../Field';
import { ListPage } from '../ListPage';

import s from './CardBody.module.scss';

export const CardBody = ({ component, card }: CardBodyProps) => {
  const t = useT();

  return (
    <div className={s.body}>
      <CardPreview card={card} />
      {card.showEmpty && <Empty>{t('noFields')}</Empty>}
      {card.fields.length > 0 && (
        <div className={s.fields}>
          {card.fields.map((field) => (
            <Field key={field.key} field={field} gallery={card.gallery[field.key]} onSet={card.setField} />
          ))}
        </div>
      )}
      {card.actionItems.length > 0 && (
        <div className={s.actions}>
          <ActionBar items={card.actionItems} />
        </div>
      )}
      {card.confirmText !== null && (
        <Confirm cancelLabel={t('cancel')} confirmLabel={t('confirm')} text={card.confirmText} onCancel={card.cancel} onConfirm={card.confirm} />
      )}
      {component.page?.kind === 'list' && <ListPage page={component.page} onRun={card.run} />}
      {card.advanced.length > 0 && <AdvancedFields fields={card.advanced} initiallyOpen={card.showAdvanced} onSet={card.setField} />}
      {component.fields.length > 0 && (
        <div className={s.footer}>
          <Button disabled={card.changedCount === 0} size='small' variant='ghost' onClick={card.reset}>
            <span className={s.reset}>
              <Icon className={s.resetIcon} name='rotate-ccw' size={14} tone={card.changedCount === 0 ? 'muted' : 'accent'} />
              {t('resetDefaults')}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};
