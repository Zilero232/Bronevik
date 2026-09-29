import { useTranslations } from 'use-intl';

import { HelpTip, PageHeader, Spinner } from '@/ui-kit';
import { ConflictReport } from '@/widgets/conflict-report';
import { FirstRun } from '@/widgets/first-run';
import { HomeSummary } from '@/widgets/home-summary';
import { PatchStatus } from '@/widgets/patch-status';

import { useHomeView } from '../model/hooks';

export const HomeView = () => {
  const t = useTranslations();
  const { isLoading, isInstalled } = useHomeView();

  return (
    <>
      <PageHeader
        description={t('home.description')}
        help={<HelpTip label={t('help.tipLabel')}>{t('help.tips.home')}</HelpTip>}
        title={t('home.title')}
      />
      {isLoading && <Spinner label={t('common.loading')} />}
      {!isLoading && !isInstalled && <FirstRun />}
      {!isLoading && isInstalled && (
        <>
          <HomeSummary />
          <PatchStatus />
          <ConflictReport hideWhenClean />
        </>
      )}
    </>
  );
};
