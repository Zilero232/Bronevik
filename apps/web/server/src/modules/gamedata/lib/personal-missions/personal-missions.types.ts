import type { PrismaClient } from '../../../../../generated';
import type { PersonalMissionsData } from '../parsers/personal-missions';
import type { RepoReader, SourceReader } from '../source';

export type BuildPersonalMissionsInput = {
  reader: SourceReader;
  localeReader?: RepoReader;
};

export type WritePersonalMissionsInput = {
  prisma: PrismaClient;
  gameVersionId: number;
  data: PersonalMissionsData;
};

export type PersonalMissionCounts = {
  campaigns: number;
  operations: number;
  branches: number;
  missions: number;
};

export type TankRef = {
  nation: string;
  tag: string;
};
