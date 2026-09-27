import { render } from 'preact';

import type { MountOnceInput, Unmount } from './mount-once.types';

import { DOM } from '../../../config';

const createHost = (id: string): HTMLElement => {
  const host = document.createElement(DOM.hostTag);

  host.id = id;
  document.body.appendChild(host);

  return host;
};

export const mountOnce = ({ id, node }: MountOnceInput): Unmount => {
  const existing = document.getElementById(id);

  if (existing?.hasAttribute(DOM.mountedAttribute)) {
    return () => undefined;
  }

  const host = existing ?? createHost(id);

  host.setAttribute(DOM.mountedAttribute, '');
  render(node, host);

  return () => {
    render(null, host);
    host.removeAttribute(DOM.mountedAttribute);

    if (!existing) {
      host.parentNode?.removeChild(host);
    }
  };
};
