import type { SignatureData } from '../../social.types';

export type SignatureFont = {
  name: string;
  data: Buffer;
  weight: 500 | 700;
  style: 'normal';
};

export type RenderSignatureInput = {
  data: SignatureData;
  fonts: readonly SignatureFont[];
};

export type SignatureNode = {
  type: string;
  key: null;
  props: {
    style?: Record<string, number | string>;
    children?: string | (string | SignatureNode)[] | SignatureNode;
  };
};

export type NodeInput = {
  style: Record<string, number | string>;
  children?: SignatureNode['props']['children'];
};

export type StatInput = {
  label: string;
  value: string;
  color: string;
};
