import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import type { ConditionListProps } from './ConditionList.types';

import { conditionText } from '../../../../../lib/condition-text';

import s from './ConditionList.module.scss';

export const ConditionList = ({ title, conditions }: ConditionListProps) => {
  const t = useTranslations('missions');

  return (
    <div className={s.root}>
      <h4 className={s.title}>{title}</h4>
      <ul className={s.list}>
        {conditions.map((condition) => (
          <li key={condition.progressId} className={s.item} data-header={condition.isHeader || undefined}>
            {condition.title && !condition.isHeader && <span className={s.label}>{condition.title}</span>}
            <span>
              {match(conditionText(condition))
                .with({ kind: 'text' }, ({ text }) => text)
                .with({ kind: 'series' }, ({ goal }) => t('mission.series', { goal }))
                .with({ kind: 'message' }, ({ key }) => t(`mission.${key}`))
                .with({ kind: 'generic' }, ({ id }) => t('mission.generic', { id }))
                .exhaustive()}
            </span>
            {condition.metric && <span className={s.metric}>{t(`metric.${condition.metric}`)}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
