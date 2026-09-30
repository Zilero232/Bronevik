import { useTranslations } from 'use-intl';

import { ComponentToggle } from '@/features/component/component-toggle';
import { ReportProblemButton } from '@/features/report/report-problem';
import { Card } from '@/ui-kit';

import { useGameHealthCard } from '../model/hooks';

import s from './GameHealthCard.module.scss';

export const GameHealthCard = () => {
  const t = useTranslations('health');
  const { clientPath, isVisible, title, rows } = useGameHealthCard();

  if (!isVisible) {
    return null;
  }

  return (
    <Card actions={<ReportProblemButton />} description={t('description')} title={title} tone='warning'>
      <ul className={s.list}>
        {rows.map((row) => (
          <li key={row.id} className={s.row}>
            <div className={s.text}>
              <span className={s.message}>{row.message}</span>
              <span className={s.hint}>{row.hint}</span>
              <span className={s.excerpt}>
                {row.source}: {row.excerpt}
              </span>
            </div>
            {row.canToggle && (
              <ComponentToggle checked={row.checked} clientPath={clientPath} componentId={row.id} disabled={false} libraries={[]} title={row.title} />
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
};
