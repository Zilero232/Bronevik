import { useTranslations } from 'use-intl';

import { useInstallWizard } from '@/features/setup/install-modpack';
import { Badge, Checkbox, ExternalLink } from '@/ui-kit';

import s from './DependencyList.module.scss';

export const DependencyList = () => {
  const t = useTranslations('install.dependencies');
  const { dependencies, onToggleDependency } = useInstallWizard();

  if (dependencies.length === 0) {
    return null;
  }

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('title')}</legend>
      <p className={s.hint}>{t('description')}</p>
      {dependencies.map((dependency) => (
        <div key={dependency.id} className={s.item}>
          <Checkbox
            label={
              <span className={s.label}>
                {dependency.title}
                <Badge tone={dependency.locked ? 'neutral' : 'accent'}>{t(`state.${dependency.state}`)}</Badge>
                {dependency.optional && <Badge>{t('optional')}</Badge>}
              </span>
            }
            checked={dependency.checked}
            description={dependency.state === 'user' ? t('userCopy', { file: dependency.file ?? '' }) : dependency.description}
            disabled={dependency.locked}
            onCheckedChange={(checked) => onToggleDependency({ id: dependency.id, checked })}
          />
          <p className={s.meta}>
            <span>{t('version', { version: dependency.version })}</span>
            <span>
              {t('licence')} <ExternalLink href={dependency.licenceUrl}>{dependency.licence}</ExternalLink>
            </span>
            <span>
              {t('author')} <ExternalLink href={dependency.authorUrl}>{dependency.author}</ExternalLink>
            </span>
          </p>
        </div>
      ))}
    </fieldset>
  );
};
