'use client';

import { Link2, Lock, LogIn, ShieldPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState, ErrorState, PageHero, Skeleton, Tabs } from '@/ui-kit';
import { ResourceGate } from '@/widgets/site/resource-missing';

import type { ClanWorkspacePageProps } from './ClanWorkspacePage.types';

import { WORKSPACE_VIEW } from '../config';
import { useClanWorkspace } from '../model/hooks';
import { WorkspaceCandidates, WorkspaceEvents, WorkspaceOverview, WorkspaceRoster } from './components';

import s from './ClanWorkspacePage.module.scss';

export const ClanWorkspacePage = ({ tag }: ClanWorkspacePageProps) => {
  const t = useTranslations('clanWorkspace');
  const tClans = useTranslations('clans.head');
  const workspace = useClanWorkspace(tag);

  return (
    <div className={s.root}>
      <ResourceGate
        back={{ href: ROUTES.clans.list, label: t('missingClan.back') }}
        error={{ title: t('missingClan.errorTitle') }}
        notFound={{ title: t('missingClan.notFound', { tag }) }}
        query={workspace.clan}
        skeleton={<Skeleton className={s.body} height={WORKSPACE_VIEW.skeletonHeight} shape='block' />}
      >
        {(page) => (
          <>
            <PageHero
              breadcrumbs={[
                { label: tClans('title'), href: ROUTES.clans.list },
                { label: `[${page.clan.tag}]`, href: ROUTES.clans.detail(page.clan.tag) },
                { label: t('crumb') }
              ]}
              art={{ kind: 'clan', emblem: page.clan.emblem, color: page.clan.color }}
              eyebrow={`[${page.clan.tag}] ${page.clan.name}`}
              lead={t('lead')}
              title={t('title')}
            />
            <div className={s.body}>
              {match(workspace.status)
                .with('pending', () => <Skeleton height={WORKSPACE_VIEW.skeletonHeight} shape='block' />)
                .with('guest', () => (
                  <EmptyState
                    action={
                      <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={workspace.loginHref}>
                        <LogIn aria-hidden size={14} />
                        {t('guest.action')}
                      </Link>
                    }
                    description={t('guest.description')}
                    icon={<LogIn aria-hidden size={28} />}
                    title={t('guest.title')}
                  />
                ))
                .with('outsider', () => (
                  <EmptyState
                    action={
                      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
                        <Link2 aria-hidden size={14} />
                        {t('outsider.action')}
                      </Link>
                    }
                    description={t('outsider.description', { tag: page.clan.tag })}
                    icon={<Lock aria-hidden size={28} />}
                    title={t('outsider.title')}
                  />
                ))
                .with('forbidden', () => (
                  <EmptyState description={t('forbidden.description')} icon={<Lock aria-hidden size={28} />} title={t('forbidden.title')} />
                ))
                .with('missing', () => (
                  <EmptyState
                    action={
                      workspace.canCreate && (
                        <Button disabled={workspace.isCreating} size='sm' onClick={workspace.onCreate}>
                          <ShieldPlus aria-hidden size={14} />
                          {t('missing.action')}
                        </Button>
                      )
                    }
                    description={workspace.canCreate ? t('missing.ownerDescription') : t('missing.description')}
                    icon={<ShieldPlus aria-hidden size={28} />}
                    title={t('missing.title')}
                  />
                ))
                .with('error', () => <ErrorState isRetrying={workspace.isRetrying} onRetry={workspace.onRetry} />)
                .with('ready', () =>
                  workspace.workspace ? (
                    <Tabs
                      items={[
                        {
                          value: 'overview',
                          label: t('tabs.overview'),
                          content: (
                            <WorkspaceOverview
                              clanId={page.clan.clanId}
                              isOfficer={workspace.isOfficer}
                              members={page.members}
                              workspace={workspace.workspace}
                            />
                          )
                        },
                        {
                          value: 'events',
                          label: t('tabs.events'),
                          count: workspace.workspace.upcoming.length,
                          content: <WorkspaceEvents clanId={page.clan.clanId} isOfficer={workspace.isOfficer} members={page.members} />
                        },
                        {
                          value: 'roster',
                          label: t('tabs.roster'),
                          count: page.members.length,
                          content: <WorkspaceRoster clanId={page.clan.clanId} members={page.members} />
                        },
                        ...(workspace.isOfficer
                          ? [
                              {
                                value: 'candidates' as const,
                                label: t('tabs.candidates'),
                                count: workspace.recruits,
                                content: <WorkspaceCandidates clanId={page.clan.clanId} />
                              }
                            ]
                          : [])
                      ]}
                      aria-label={t('tabs.label')}
                      value={workspace.tab}
                      variant='panel'
                      onValueChange={workspace.onTabChange}
                    />
                  ) : null
                )
                .exhaustive()}
            </div>
          </>
        )}
      </ResourceGate>
    </div>
  );
};
