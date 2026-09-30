import clsx from 'clsx';

import type { ComponentCardProps } from './ComponentCard.types';

import { Icon } from '../../../shared/ui/icon';
import { useComponentCard } from '../model/hooks';
import { CardBody, CardSwitch, CardTile, CardTitles } from './components';

import s from './ComponentCard.module.scss';

export const ComponentCard = ({ component, fields, forceOpen }: ComponentCardProps) => {
  const card = useComponentCard({ component, fields, forceOpen });

  return (
    <article className={clsx(s.card, !card.enabled && s.off, card.open && s.open)}>
      <div className={s.head}>
        <button aria-expanded={card.expandable ? card.open : undefined} className={s.main} type='button' onClick={card.toggleOpen}>
          <CardTile enabled={card.enabled} icon={card.icon} />
          <CardTitles card={card} component={component} />
          {card.expandable && <Icon className={s.chevron} name={card.open ? 'chevron-up' : 'chevron-down'} tone='text' />}
        </button>
        <CardSwitch card={card} component={component} />
      </div>
      {card.open && <CardBody card={card} component={component} />}
    </article>
  );
};
