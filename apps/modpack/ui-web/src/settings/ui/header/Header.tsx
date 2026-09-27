import clsx from 'clsx';

import type { HeaderProps } from './Header.types';

import { useHeader } from '../../model/hooks/use-header/use-header';
import { useT } from '../../model/hooks/use-t/use-t';

export const Header = ({ state }: HeaderProps) => {
  const t = useT();
  const header = useHeader();

  return (
    <header className='header'>
      <div className='brand'>
        <span className='brand__mark'>{'///'}</span>
        <div className='brand__text'>
          <span className='brand__title'>{t('title')}</span>
          <span className='brand__subtitle'>{t('subtitle')}</span>
        </div>
      </div>
      <div className='header__status'>
        <span className={clsx('chip', state.status.bound ? 'chip--ok' : 'chip--warn')}>{state.status.bound ? t('bound') : t('unbound')}</span>
        <span className='header__status-text'>{state.status.text}</span>
      </div>
      {!state.status.bound && (
        <div className='header__bind'>
          <input
            className='input input--code'
            maxLength={16}
            placeholder={t('bindPlaceholder')}
            value={header.code}
            onInput={(event) => header.setCode(event.currentTarget.value)}
          />
          <button className='button button--accent' type='button' onClick={header.bind}>
            {t('bind')}
          </button>
        </div>
      )}
      <div className='header__tools'>
        <button className='button button--ghost' type='button' onClick={header.openSite}>
          {t('openSite')}
        </button>
        <div className='segmented'>
          {(['ru', 'en'] as const).map((language) => (
            <button
              key={language}
              className={clsx('segmented__item', state.language === language && 'segmented__item--on')}
              type='button'
              onClick={() => header.language(language)}
            >
              {language.toUpperCase()}
            </button>
          ))}
        </div>
        <button aria-label={t('close')} className='button button--icon' type='button' onClick={header.close}>
          ×
        </button>
      </div>
    </header>
  );
};
