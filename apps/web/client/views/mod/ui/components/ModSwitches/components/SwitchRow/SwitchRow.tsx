import { Badge } from '@/ui-kit';

import type { SwitchRowProps } from './SwitchRow.types';

import s from './SwitchRow.module.scss';

export const SwitchRow = ({ title, setting, text, value }: SwitchRowProps) => (
  <div className={s.row}>
    <dt className={s.term}>
      <span className={s.name}>{title}</span>
      <code className={s.key}>{setting}</code>
    </dt>
    <dd className={s.description}>{text}</dd>
    <dd className={s.value}>
      <Badge tone='neutral'>{value}</Badge>
    </dd>
  </div>
);
