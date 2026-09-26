import type { TechTree } from '@bronevik/schemas';

import type { TechTreeInput } from './tree.types';

import { treeControllerTree } from '../generated';
import { fromSdk } from '../source';

export const getTechTree = ({ signal, nation }: TechTreeInput): Promise<TechTree> => fromSdk(() => treeControllerTree({ path: { nation }, signal }));
