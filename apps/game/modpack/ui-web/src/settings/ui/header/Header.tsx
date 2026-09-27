import clsx from 'clsx';

import type { HeaderProps } from './Header.types';

import { LogoMark } from '../../../shared/ui/logo-mark';
import { HEADER, INPUT_LIMITS } from '../../config';
import { useHeader } from '../../model/hooks/use-header';
import { useT } from '../../model/hooks/use-t';
import { Button } from '../button';
import { Input } from '../input';
import { Segmented } from '../segmented';

import s from './Header.module.scss';

export const Header = ({ state }: HeaderProps) => {
  const t = useT();
  const header = useHeader();

  return (
    <header className={s.header}>
      <div className={s.brand}>
        <LogoMark className={s.mark} size={HEADER.logoSize} />
        <div className={s.brandText}>
          <span className={s.title}>{t('title')}</span>
          <span className={s.subtitle}>{t('subtitle')}</span>
        </div>
      </div>
      <div className={s.status}>
        <span className={clsx(s.chip, state.status.bound ? s.chipOk : s.chipWarn)}>{state.status.bound ? t('bound') : t('unbound')}</span>
        <span className={s.statusText}>{state.status.text}</span>
      </div>
      {!state.status.bound && (
        <div className={s.bind}>
          <Input
            className={s.bindInput}
            maxLength={INPUT_LIMITS.bindCode}
            placeholder={t('bindPlaceholder')}
            value={header.code}
            variant='code'
            onInput={(event) => header.setCode(event.currentTarget.value)}
          />
          <Button variant='accent' onClick={header.bind}>
            {t('bind')}
          </Button>
        </div>
      )}
      <div className={s.tools}>
        <Button className={s.tool} variant='ghost' onClick={header.openSite}>
          {t('openSite')}
        </Button>
        <Segmented className={s.tool} items={header.languages} value={state.language} onSelect={header.language} />
        <Button aria-label={t('close')} className={s.tool} size='icon' onClick={header.close}>
          ×
        </Button>
      </div>
    </header>
  );
};
