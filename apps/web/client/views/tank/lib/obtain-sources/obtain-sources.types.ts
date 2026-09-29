import type { VehicleSourceKind } from '@otmetki/schemas';

export type ObtainMission = {
  key: string;
  href: string;
  campaign: string | null;
  operation: string | null;
  isCampaignReward: boolean;
};

type ObtainEditorialEvent = {
  title: string;
  href: string | undefined;
};

export type ObtainEditorial = {
  key: string;
  kind: VehicleSourceKind;
  title: string | null;
  href: string | undefined;
  missionHref: string | undefined;
  note: string | null;
  startsAt: string | null;
  endsAt: string | null;
  event: ObtainEditorialEvent | null;
};
