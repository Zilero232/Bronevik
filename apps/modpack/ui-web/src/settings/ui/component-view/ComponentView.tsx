import type { ComponentViewProps } from './ComponentView.types';

import { setSetting, toggleSwitch } from '../../model/actions';
import { useActions } from '../../model/hooks/use-actions';
import { useT } from '../../model/hooks/use-t';
import { Confirm } from '../confirm';
import { Field } from '../field';
import { ListPage } from '../list-page';
import { Toggle } from '../toggle';

export const ComponentView = ({ component }: ComponentViewProps) => {
  const t = useT();
  const actions = useActions(component.id);

  return (
    <article className='card'>
      <header className='card__head'>
        <div className='card__titles'>
          <h2 className='section-title'>{component.title}</h2>
          {component.hint && <p className='card__hint'>{component.hint}</p>}
        </div>
        {component.switch && (
          <div className='card__switch'>
            <span className='card__switch-label'>{component.switch.value ? t('on') : t('off')}</span>
            <Toggle label={component.title} on={component.switch.value} onToggle={() => toggleSwitch(component)} />
          </div>
        )}
      </header>
      <div className='card__fields'>
        {component.fields.length === 0 && !component.page && <p className='empty'>{t('noFields')}</p>}
        {component.fields.map((field) => (
          <Field key={field.key} field={field} onSet={(input) => setSetting({ component: component.id, ...input })} />
        ))}
      </div>
      {component.actions.length > 0 && (
        <div className='card__actions'>
          {component.actions.map((action) => (
            <button key={action.id} className='button' type='button' onClick={() => actions.run({ action })}>
              {action.label}
            </button>
          ))}
        </div>
      )}
      {actions.pending && <Confirm text={actions.pending.action.confirm ?? ''} onCancel={actions.cancel} onConfirm={actions.confirm} />}
      {component.page && <ListPage page={component.page} onRun={actions.run} />}
    </article>
  );
};
