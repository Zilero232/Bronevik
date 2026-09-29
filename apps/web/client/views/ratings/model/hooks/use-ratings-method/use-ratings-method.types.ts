import type { METHOD_SECTIONS } from '../../../config';

export type MethodSectionId = (typeof METHOD_SECTIONS)[number];

export type MethodSectionData = {
  id: MethodSectionId;
  title: string;
  lead: string;
  lines: string[];
  notes: string[];
};
