import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

export const HudPointerContext = createContext(false);

export const useHudPointer = (): boolean => useContext(HudPointerContext);
