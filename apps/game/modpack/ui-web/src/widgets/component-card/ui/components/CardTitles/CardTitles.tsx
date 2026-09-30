import clsx from 'clsx';

import type { CardTitlesProps } from './CardTitles.types';

import { useT } from '../../../../../entities/window-state';
import { Badge } from '../../../../../shared/ui/badge';

import s from './CardTitles.module.scss';

export const CardTitles = ({ component, card }: CardTitlesProps) => {
  const t = useT();

  return (
    <span className={s.titles}>
      <span className={s.titleRow}>
        <span className={s.title}>{component.title}</span>
        {card.badges.map((badge) => (
          <Badge key={badge.key} icon={badge.icon}>
            {t(badge.key)}
          </Badge>
        ))}
        {component.panel && <Badge icon='monitor'>{t('panelBadge')}</Badge>}
        {card.changedCount > 0 && <Badge tone='accent'>{`${t('changedBadge')}: ${card.changedCount}`}</Badge>}
      </span>
      {component.hint && <span className={clsx(s.hint, card.open && s.hintFull)}>{component.hint}</span>}
    </span>
  );
};
