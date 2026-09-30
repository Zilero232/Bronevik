import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import type { ComponentCardProps } from './ComponentCard.types';

import { MOD_PAGE, MOD_SHOWCASE_CONTEXT_TONE } from '../../../../../config';

import s from './ComponentCard.module.scss';

export const ComponentCard = ({ item }: ComponentCardProps) => {
  const t = useTranslations('mod.showcase');

  return (
    <li className={s.card}>
      <span aria-hidden className={s.icon}>
        <item.icon size={MOD_PAGE.cardIconSize} />
      </span>
      <div className={s.body}>
        <h3 className={s.title}>{t(`components.${item.id}.title`)}</h3>
        <p className={s.text}>{t(`components.${item.id}.text`)}</p>
        <div className={s.badges}>
          <Badge tone={MOD_SHOWCASE_CONTEXT_TONE[item.context]}>{t(`context.${item.context}`)}</Badge>
          {item.isDefault && <Badge tone='success'>{t('default')}</Badge>}
        </div>
      </div>
    </li>
  );
};
