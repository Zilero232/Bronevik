import type { ChallengeKeyInput, LevelKeyInput, PurchaseKeyInput, SeasonRewardKeyInput } from './ledger-keys.types';

export const levelKey = ({ accountId, tankId, level }: LevelKeyInput): string => `level:${accountId}:${tankId}:${level}`;

export const challengeKey = ({ accountId, tankId, week, code }: ChallengeKeyInput): string => `challenge:${accountId}:${tankId}:${week}:${code}`;

export const seasonRewardKey = ({ userId, season, level }: SeasonRewardKeyInput): string => `season:${season}:${userId}:${level}`;

export const purchaseKey = ({ userId, code }: PurchaseKeyInput): string => `purchase:${userId}:${code}`;
