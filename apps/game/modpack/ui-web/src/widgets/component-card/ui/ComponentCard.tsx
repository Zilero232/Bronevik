import clsx from 'clsx';

import type { ComponentCardProps } from './ComponentCard.types';

import { useT } from '../../../entities/window-state';
import { Badge } from '../../../shared/ui/badge';
import { Icon } from '../../../shared/ui/icon';
import { Toggle } from '../../../shared/ui/toggle';
import { useComponentCard } from '../model/hooks';
import { CardBody } from './components';

import s from './ComponentCard.module.scss';

export const ComponentCard = ({ component, fields, forceOpen }: ComponentCardProps) => {
  const t = useT();
  const card = useComponentCard({ component, fields, forceOpen });

  return (
    <article className={clsx(s.card, !card.enabled && s.off, card.open && s.open)}>
      <div className={s.head}>
        <button aria-expanded={card.expandable ? card.open : undefined} className={s.main} type='button' onClick={card.toggleOpen}>
          <span className={clsx(s.tile, card.enabled && s.tileOn)}>
            <Icon name={card.icon} size={20} tone={card.enabled ? 'accent' : 'muted'} />
          </span>
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
          {card.expandable && <Icon className={s.chevron} name={card.open ? 'chevron-up' : 'chevron-down'} tone='text' />}
        </button>
        {component.switch && (
          <span className={s.switch}>
            <span className={s.switchLabel}>{t(card.switchLabelKey)}</span>
            <Toggle label={component.title} on={component.switch.value} onToggle={card.toggle} />
          </span>
        )}
      </div>
      {card.open && <CardBody card={card} component={component} />}
    </article>
  );
};
