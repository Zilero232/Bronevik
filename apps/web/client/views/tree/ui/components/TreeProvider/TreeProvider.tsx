'use client';

import type { TreeProviderProps } from './TreeProvider.types';

import { TreeContext } from '../../../model/context';

export const TreeProvider = ({ children, ...value }: TreeProviderProps) => <TreeContext value={value}>{children}</TreeContext>;
