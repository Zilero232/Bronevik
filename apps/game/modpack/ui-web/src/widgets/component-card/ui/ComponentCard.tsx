import type { ComponentCardProps } from './ComponentCard.types';

import { useT } from '../../../entities/window-state';
import { ActionBar } from '../../../shared/ui/action-bar';
import { Card } from '../../../shared/ui/card';
import { Confirm } from '../../../shared/ui/confirm';
import { Empty } from '../../../shared/ui/empty';
import { Toggle } from '../../../shared/ui/toggle';
import { useComponentCard } from '../model/hooks';
import { Field, ListPage } from './components';

import s from './ComponentCard.module.scss';

export const ComponentCard = ({ component }: ComponentCardProps) => {
  const t = useT();
  const card = useComponentCard(component);

  return (
    <Card
      aside={
        component.switch && (
          <div className={s.switch}>
            <span className={s.switchLabel}>{t(card.switchLabelKey)}</span>
            <Toggle label={component.title} on={component.switch.value} onToggle={card.toggle} />
          </div>
        )
      }
      hint={component.hint}
      title={component.title}
    >
      <div className={s.fields}>
        {card.showEmpty && <Empty>{t('noFields')}</Empty>}
        {component.fields.map((field) => (
          <Field key={field.key} field={field} onSet={card.setField} />
        ))}
      </div>
      {card.actionItems.length > 0 && <ActionBar items={card.actionItems} />}
      {card.confirmText !== null && (
        <Confirm cancelLabel={t('cancel')} confirmLabel={t('confirm')} text={card.confirmText} onCancel={card.cancel} onConfirm={card.confirm} />
      )}
      {component.page && <ListPage page={component.page} onRun={card.run} />}
    </Card>
  );
};
