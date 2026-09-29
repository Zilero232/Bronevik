export type PlayerSection = 'activity' | 'history' | 'insights' | 'marks' | 'nicknames' | 'playtime' | 'session' | 'sessions' | 'tanks' | 'wrapped';

export type PlayerSectionKeyInput = {
  accountId: number;
  section: PlayerSection;
  params?: object;
};

export type MeSection = 'accounts' | 'bots' | 'devices' | 'favorites' | 'goals' | 'notifications';

export type GuideViewerKeyInput = {
  viewerId: string | null;
};

export type GuideListKeyInput = GuideViewerKeyInput & {
  params: object;
};

export type GuideDetailKeyInput = GuideViewerKeyInput & {
  slug: string;
};

export type ClanWorkspaceKeyInput = {
  clanId: number;
  params: object;
};

export type BlogViewerKeyInput = {
  viewerId: string | null;
};

export type BlogEditorPostKeyInput = BlogViewerKeyInput & {
  id: string;
};
