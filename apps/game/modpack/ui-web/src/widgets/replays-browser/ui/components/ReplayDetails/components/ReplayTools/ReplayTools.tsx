import clsx from 'clsx';

import type { DetailsActionProps } from '../../ReplayDetails.types';

import { Button } from '../../../../../../../shared/ui/button';
import { useReplaysT } from '../../../../../model/hooks';
import { ReplayIcon } from '../../../ReplayIcon';

import s from './ReplayTools.module.scss';

export const ReplayTools = ({ item, browser }: DetailsActionProps) => {
  const t = useReplaysT();

  return (
    <div className={s.tools}>
      <Button className={clsx(s.tool, item.favourite && s.favourite)} size='small' variant='ghost' onClick={() => browser.toggleFavourite(item)}>
        <ReplayIcon className={s.buttonIcon} name='star' size={14} />
        {item.favourite ? t('favouriteRemove') : t('favouriteAdd')}
      </Button>
      <Button className={s.tool} size='small' variant='ghost' onClick={() => browser.startRename(item)}>
        <ReplayIcon className={s.buttonIcon} name='pencil' size={14} />
        {t('rename')}
      </Button>
      <Button className={clsx(s.tool, s.remove)} size='small' variant='ghost' onClick={() => browser.askRemove(item)}>
        <ReplayIcon className={s.buttonIcon} name='trash' size={14} />
        {t('remove')}
      </Button>
    </div>
  );
};
