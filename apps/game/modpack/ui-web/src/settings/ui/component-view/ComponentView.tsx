import type { ComponentViewProps } from './ComponentView.types';

import { setSetting, toggleSwitch } from '../../model/actions';
import { useActions } from '../../model/hooks/use-actions';
import { useT } from '../../model/hooks/use-t';
import { Card, CardAction, CardActions } from '../card';
import { Confirm } from '../confirm';
import { Empty } from '../empty';
import { Field } from '../field';
import { ListPage } from '../list-page';
import { Toggle } from '../toggle';

import s from './ComponentView.module.scss';

export const ComponentView = ({ component }: ComponentViewProps) => {
  const t = useT();
  const actions = useActions(component.id);

  return (
    <Card
      aside={
        component.switch && (
          <div className={s.switch}>
            <span className={s.switchLabel}>{component.switch.value ? t('on') : t('off')}</span>
            <Toggle label={component.title} on={component.switch.value} onToggle={() => toggleSwitch(component)} />
          </div>
        )
      }
      hint={component.hint}
      title={component.title}
    >
      <div className={s.fields}>
        {component.fields.length === 0 && !component.page && <Empty>{t('noFields')}</Empty>}
        {component.fields.map((field) => (
          <Field key={field.key} field={field} onSet={(input) => setSetting({ component: component.id, ...input })} />
        ))}
      </div>
      {component.actions.length > 0 && (
        <CardActions>
          {component.actions.map((action) => (
            <CardAction key={action.id} onClick={() => actions.run({ action })}>
              {action.label}
            </CardAction>
          ))}
        </CardActions>
      )}
      {actions.pending && <Confirm text={actions.pending.action.confirm ?? ''} onCancel={actions.cancel} onConfirm={actions.confirm} />}
      {component.page && <ListPage page={component.page} onRun={actions.run} />}
    </Card>
  );
};
