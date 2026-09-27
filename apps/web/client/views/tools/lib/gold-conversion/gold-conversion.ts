import { GOLD } from '../../config';

export const goldToCredits = (gold: number): number => Math.max(0, gold) * GOLD.creditsPerGold;

export const creditsToGold = (credits: number): number => Math.ceil(Math.max(0, credits) / GOLD.creditsPerGold);

export const goldToFreeXp = (gold: number): number => Math.max(0, gold) * GOLD.xpPerGold;

export const freeXpToGold = (xp: number): number => Math.ceil(Math.max(0, xp) / GOLD.xpPerGold);
