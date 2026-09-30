import type { SearchBoxProps } from './SearchBox.types';

import { useT } from '../../../../../entities/window-state';
import { IconButton } from '../../../../../shared/ui/icon-button';
import { Input } from '../../../../../shared/ui/input';
import { HEADER } from '../../../config';

import s from './SearchBox.module.scss';

export const SearchBox = ({ query, onChange, onClear }: SearchBoxProps) => {
  const t = useT();

  return (
    <div className={s.search} role='search'>
      <Input
        aria-label={t('searchPlaceholder')}
        className={s.input}
        icon='search'
        maxLength={HEADER.searchMaxLength}
        placeholder={t('searchPlaceholder')}
        value={query}
        variant='wide'
        onInput={(event) => onChange(event.currentTarget.value)}
      />
      {query && <IconButton className={s.clear} icon='x' label={t('searchClear')} size='small' variant='ghost' onClick={onClear} />}
    </div>
  );
};
