import { createContext, use } from 'react';

export const HudPointerContext = createContext(false);

export const useHudPointer = (): boolean => use(HudPointerContext);
