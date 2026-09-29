import type { EventLayoutProps } from './EventLayout.types';

import s from './EventLayout.module.scss';

export const EventLayout = ({ main, aside }: EventLayoutProps) => (
  <div className={s.root}>
    <div className={s.main}>{main}</div>
    <aside className={s.side}>{aside}</aside>
  </div>
);
