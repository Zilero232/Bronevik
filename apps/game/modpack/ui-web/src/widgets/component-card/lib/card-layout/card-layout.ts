import type { CardLayout, CardLayoutInput, PanelPreviewInput, PreviewPanel } from './card-layout.types';

export const cardLayout = ({ component, fields, isExpanded, forceOpen }: CardLayoutInput): CardLayout => {
  const shown = fields ?? component.fields;
  const hasListPage = component.page?.kind === 'list';
  const hasContent = shown.length > 0 || component.actions.length > 0 || hasListPage;
  const expandable = hasContent || component.panel;

  return {
    fields: shown,
    expandable,
    open: expandable && (forceOpen || isExpanded),
    showEmpty: !hasContent
  };
};

export const panelPreview = ({ component, panels }: PanelPreviewInput): PreviewPanel | null => {
  if (!component.panel) {
    return null;
  }

  return panels.find(({ id }) => id === component.id) ?? null;
};
