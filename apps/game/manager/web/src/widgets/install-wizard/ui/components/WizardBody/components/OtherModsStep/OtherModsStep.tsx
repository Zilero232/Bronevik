import { useTranslations } from 'use-intl';

import { useInstallWizard } from '@/features/setup/install-modpack';
import { Badge, Card, Checkbox, EmptyState } from '@/ui-kit';

import s from './OtherModsStep.module.scss';

export const OtherModsStep = () => {
  const t = useTranslations('install');
  const { plan, removeOthers, onToggleOther } = useInstallWizard();
  const otherMods = plan?.otherMods ?? [];

  return (
    <Card
      actions={removeOthers.size > 0 && <Badge tone='danger'>{t('otherModsSelected', { count: removeOthers.size })}</Badge>}
      description={t('otherModsDescription')}
      title={t('steps.otherMods')}
    >
      {otherMods.length > 0 ? (
        <ul className={s.list}>
          {otherMods.map((entry) => (
            <li key={entry.path}>
              <Checkbox
                label={
                  <span className={s.label}>
                    {entry.name} <Badge>{t(`location.${entry.location}`)}</Badge>
                  </span>
                }
                checked={removeOthers.has(entry.path)}
                description={entry.path}
                onCheckedChange={(checked) => onToggleOther({ id: entry.path, checked })}
              />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title={t('otherModsEmpty')} />
      )}
    </Card>
  );
};
