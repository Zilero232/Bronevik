import { isNation, NATION_ICONS } from '@bronevik/icons';
import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import type { NationLabelProps } from './NationLabel.types';

import s from './NationLabel.module.scss';

export const NationLabel = ({ nation, withName = true, size = 16, className }: NationLabelProps) => {
  const t = useTranslations('game.nations');

  if (!isNation(nation)) {
    return <span className={clsx(s.root, className)}>{nation}</span>;
  }

  const Icon = NATION_ICONS[nation];
  const name = t(nation);

  return (
    <span className={clsx(s.root, className)} data-nation={nation}>
      <Icon palette='color' size={size} title={withName ? undefined : name} />
      {withName && <span className={s.name}>{name}</span>}
    </span>
  );
};
