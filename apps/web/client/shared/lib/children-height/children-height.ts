export const childrenHeight = (node: Element): number => {
  const rects = [...node.children].map((child) => child.getBoundingClientRect()).filter(({ height }) => height > 0);

  if (rects.length === 0) {
    return 0;
  }

  return Math.round(Math.max(...rects.map(({ bottom }) => bottom)) - Math.min(...rects.map(({ top }) => top)));
};
