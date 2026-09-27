import type { ListPageProps } from './ListPage.types';

import { useRowDetails } from '../../model/hooks/use-row-details';
import { useRowEditor } from '../../model/hooks/use-row-editor';
import { useT } from '../../model/hooks/use-t';
import { Badge } from '../badge';
import { Empty } from '../empty';
import { Row, RowActions, RowButton, RowInput, RowList, RowMain, RowNote } from '../row';

import s from './ListPage.module.scss';

export const ListPage = ({ page, onRun }: ListPageProps) => {
  const t = useT();
  const editor = useRowEditor(onRun);
  const details = useRowDetails();

  if (page.rows.length === 0) {
    return <Empty>{page.empty}</Empty>;
  }

  return (
    <RowList>
      {page.rows.map((row) => (
        <Row key={row.id}>
          <RowMain badge={row.badge && <Badge>{row.badge}</Badge>} title={row.title}>
            {row.subtitle && <RowNote>{row.subtitle}</RowNote>}
            {row.meta && <RowNote>{row.meta}</RowNote>}
            {row.details && row.details.length > 0 && details.isOpen(row.id) && (
              <dl className={s.details}>
                {row.details.map((detail) => (
                  <div key={`${detail.label}|${detail.value}`} className={s.detail}>
                    {detail.label && <dt className={s.detailLabel}>{detail.label}</dt>}
                    <dd className={s.detailValue}>{detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </RowMain>
          {editor.draft?.row === row.id ? (
            <RowActions>
              <RowInput value={editor.draft.value} onInput={(event) => editor.edit(event.currentTarget.value)} />
              <RowButton variant='accent' onClick={editor.submit}>
                {t('save')}
              </RowButton>
              <RowButton variant='ghost' onClick={editor.stop}>
                {t('cancel')}
              </RowButton>
            </RowActions>
          ) : (
            <RowActions>
              {row.details && row.details.length > 0 && (
                <RowButton size='small' variant='ghost' onClick={() => details.toggle(row.id)}>
                  {details.isOpen(row.id) ? t('hideDetails') : t('details')}
                </RowButton>
              )}
              {row.actions.map((action) => (
                <RowButton key={action.id} size='small' onClick={() => editor.choose({ row: row.id, action })}>
                  {action.label}
                </RowButton>
              ))}
            </RowActions>
          )}
        </Row>
      ))}
    </RowList>
  );
};
