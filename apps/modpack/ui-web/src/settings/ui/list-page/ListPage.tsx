import type { ListPageProps } from './ListPage.types';

import { useRowEditor } from '../../model/hooks/use-row-editor/use-row-editor';
import { useT } from '../../model/hooks/use-t/use-t';

export const ListPage = ({ page, onRun }: ListPageProps) => {
  const t = useT();
  const editor = useRowEditor(onRun);

  if (page.rows.length === 0) {
    return <p className='empty'>{page.empty}</p>;
  }

  return (
    <ul className='rows'>
      {page.rows.map((row) => (
        <li key={row.id} className='row'>
          <div className='row__main'>
            <div className='row__title-line'>
              <span className='row__title'>{row.title}</span>
              {row.badge && <span className='badge'>{row.badge}</span>}
            </div>
            {row.subtitle && <span className='row__subtitle'>{row.subtitle}</span>}
            {row.meta && <span className='row__meta'>{row.meta}</span>}
          </div>
          {editor.draft?.row === row.id ? (
            <div className='row__edit'>
              <input className='input' value={editor.draft.value} onInput={(event) => editor.edit(event.currentTarget.value)} />
              <button className='button button--accent' type='button' onClick={editor.submit}>
                {t('save')}
              </button>
              <button className='button button--ghost' type='button' onClick={editor.stop}>
                {t('cancel')}
              </button>
            </div>
          ) : (
            <div className='row__actions'>
              {row.actions.map((action) => (
                <button key={action.id} className='button button--small' type='button' onClick={() => editor.choose({ row: row.id, action })}>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};
