import type { z } from 'zod';

import type { techTreeEdgeSchema, techTreeNodeSchema, techTreeParamsSchema, techTreeSchema } from './tree.schemas';

export type TechTreeParams = z.infer<typeof techTreeParamsSchema>;
export type TechTreeNode = z.infer<typeof techTreeNodeSchema>;
export type TechTreeEdge = z.infer<typeof techTreeEdgeSchema>;
export type TechTree = z.infer<typeof techTreeSchema>;
