import type { LeadFeedProps } from './LeadFeed.types';

import s from './LeadFeed.module.scss';

export const LeadFeed = <Item,>({ lead, items, itemKey, renderItem }: LeadFeedProps<Item>) => (
  <div className={s.root}>
    {lead}
    {items.length > 0 && (
      <ul className={s.grid}>
        {items.map((item) => (
          <li key={itemKey(item)} className={s.cell}>
            {renderItem(item)}
          </li>
        ))}
      </ul>
    )}
  </div>
);
