import type { TechTree } from '@otmetki/schemas';

import { treeControllerTree } from '@/shared/api/generated';
import { fromSdk } from '@/shared/api/source';

import type { TechTreeInput } from './tree.types';

export const getTechTree = ({ signal, nation }: TechTreeInput): Promise<TechTree> => fromSdk(() => treeControllerTree({ path: { nation }, signal }));
