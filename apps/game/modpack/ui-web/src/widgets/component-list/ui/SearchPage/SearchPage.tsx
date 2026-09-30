import type { SearchPageProps } from './SearchPage.types';

import { useT } from '../../../../entities/window-state';
import { Empty } from '../../../../shared/ui/empty';
import { PageHeader } from '../../../../shared/ui/page-header';
import { ScrollArea } from '../../../../shared/ui/scroll-area';
import { useSearchPage } from '../../model/hooks';
import { CardColumns } from '../components';

import s from './SearchPage.module.scss';

export const SearchPage = ({ columns, card }: SearchPageProps) => {
  const t = useT();
  const search = useSearchPage(columns);

  return (
    <div className={s.page}>
      <PageHeader hint={t('searchHint')} icon='search' title={`${t('searchTitle')}: ${search.query}`} />
      <ScrollArea contentClassName={s.content} label={t('searchTitle')}>
        {search.empty && <Empty>{t('searchEmpty')}</Empty>}
        <CardColumns forceOpen card={card} columns={search.columns} />
      </ScrollArea>
    </div>
  );
};
