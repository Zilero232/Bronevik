'use client';

import type { TreeProviderProps } from './tree-context.types';

import { TreeContext } from './tree-context';

export const TreeProvider = ({ children, ...value }: TreeProviderProps) => <TreeContext value={value}>{children}</TreeContext>;
