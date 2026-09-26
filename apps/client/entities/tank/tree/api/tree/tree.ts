import type { TechTree } from '@otmetki/schemas';

import type { TechTreeInput } from './tree.types';

import { treeControllerTree } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

export const getTechTree = ({ signal, nation }: TechTreeInput): Promise<TechTree> => fromSdk(() => treeControllerTree({ path: { nation }, signal }));
