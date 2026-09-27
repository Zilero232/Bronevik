import clsx from 'clsx';

import type { ProfilesProps } from './Profiles.types';

import { useProfiles } from '../../model/hooks/use-profiles/use-profiles';
import { useT } from '../../model/hooks/use-t/use-t';
import { Confirm } from '../confirm/Confirm';

export const Profiles = ({ profiles }: ProfilesProps) => {
  const t = useT();
  const model = useProfiles(profiles);

  return (
    <article className='card'>
      <header className='card__head'>
        <div className='card__titles'>
          <h2 className='section-title'>{t('sectionProfiles')}</h2>
          <p className='card__hint'>{t('profilesHint')}</p>
        </div>
      </header>
      <div className='inline-form'>
        <input
          className='input input--wide'
          maxLength={40}
          placeholder={t('profileName')}
          value={model.name}
          onInput={(event) => model.setName(event.currentTarget.value)}
        />
        <button className='button button--accent' type='button' onClick={model.saveNew}>
          {t('profileSaveNew')}
        </button>
      </div>
      {profiles.items.length === 0 && <p className='empty'>{t('profilesEmpty')}</p>}
      <ul className='rows'>
        {profiles.items.map((profile) => (
          <li key={profile.id} className={clsx('row', profiles.active === profile.id && 'row--active')}>
            {model.renaming?.id === profile.id ? (
              <div className='row__edit'>
                <input
                  className='input'
                  maxLength={40}
                  value={model.renaming.name}
                  onInput={(event) => model.editRename(event.currentTarget.value)}
                />
                <button className='button button--accent' type='button' onClick={model.commitRename}>
                  {t('save')}
                </button>
                <button className='button button--ghost' type='button' onClick={model.cancelRename}>
                  {t('cancel')}
                </button>
              </div>
            ) : (
              <>
                <div className='row__main'>
                  <div className='row__title-line'>
                    <span className='row__title'>{profile.name}</span>
                    {profiles.active === profile.id && <span className='badge badge--gold'>{t('profileActive')}</span>}
                  </div>
                </div>
                <div className='row__actions'>
                  <button className='button button--small button--accent' type='button' onClick={() => model.load(profile.id)}>
                    {t('profileLoad')}
                  </button>
                  <button className='button button--small' type='button' onClick={() => model.overwrite(profile.id)}>
                    {t('profileOverwrite')}
                  </button>
                  <button className='button button--small' type='button' onClick={() => model.startRename({ id: profile.id, name: profile.name })}>
                    {t('profileRename')}
                  </button>
                  <button className='button button--small' type='button' onClick={() => model.exportCode(profile.id)}>
                    {t('profileExport')}
                  </button>
                  <button className='button button--small button--danger' type='button' onClick={() => model.askDelete(profile.id)}>
                    {t('profileDelete')}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      {model.deleting && <Confirm text={t('profileDeleteConfirm')} onCancel={model.cancelDelete} onConfirm={model.confirmDelete} />}
      <div className='inline-form'>
        <input
          className='input input--wide'
          placeholder={t('profileImportPlaceholder')}
          value={model.importCode}
          onInput={(event) => model.setImportCode(event.currentTarget.value)}
        />
        <button className='button' type='button' onClick={model.importProfile}>
          {t('profileImport')}
        </button>
      </div>
    </article>
  );
};
