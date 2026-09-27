import type { ListPageProps } from './ListPage.types';

import { Empty } from '../../../../../shared/ui/empty';
import { List } from '../../../../../shared/ui/list';
import { useListPage } from '../../../model/hooks';
import { ListPageRow } from './components';

export const ListPage = ({ page, onRun }: ListPageProps) => {
  const rows = useListPage({ rows: page.rows, onRun });

  if (rows.length === 0) {
    return <Empty>{page.empty}</Empty>;
  }

  return (
    <List>
      {rows.map((item) => (
        <ListPageRow key={item.row.id} item={item} />
      ))}
    </List>
  );
};
