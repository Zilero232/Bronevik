import type { SeasonTrack, Shells, TankChallenges, TankProgressList } from '@otmetki/schemas';
import { progressionControllerChallenges, progressionControllerSeason, progressionControllerShellLedger, progressionControllerTankLevels } from '@/shared/api/generated';
import { SESSION_REQUEST } from '@/shared/api/http';
import { fromSdk } from '@/shared/api/source';

export const getTankLevels = (): Promise<TankProgressList> => fromSdk(() => progressionControllerTankLevels(SESSION_REQUEST));

export const getTankChallenges = (): Promise<TankChallenges> => fromSdk(() => progressionControllerChallenges(SESSION_REQUEST));

export const getSeasonTrack = (): Promise<SeasonTrack> => fromSdk(() => progressionControllerSeason(SESSION_REQUEST));

export const getShells = (): Promise<Shells> => fromSdk(() => progressionControllerShellLedger(SESSION_REQUEST));
