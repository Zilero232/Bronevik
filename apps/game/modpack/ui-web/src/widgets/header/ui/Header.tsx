import type { HeaderProps } from './Header.types';

import { useHeader } from '../model/hooks';
import { AccountChip, Brand, SearchBox, Tools, ZoomControl } from './components';

import s from './Header.module.scss';

export const Header = ({ language, compact, frame }: HeaderProps) => {
  const header = useHeader();

  return (
    <header className={s.header}>
      <Brand compact={compact} onMoveStart={frame.onMoveStart} onRecentre={frame.onRecentre} />
      <SearchBox query={header.query} onChange={header.setQuery} onClear={header.clearQuery} />
      {header.account && <AccountChip account={header.account} compact={compact} onOpen={header.openAccount} />}
      <ZoomControl frame={frame} />
      <Tools language={language} />
    </header>
  );
};
