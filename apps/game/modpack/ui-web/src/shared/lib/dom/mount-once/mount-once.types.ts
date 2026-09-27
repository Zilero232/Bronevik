import type { ComponentChild } from 'preact';

export type MountOnceInput = {
  id: string;
  node: ComponentChild;
};

export type Unmount = () => void;
