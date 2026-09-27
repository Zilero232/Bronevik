import { mountOnce, onDomReady } from '../../shared/lib/dom';
import { SETTINGS_PAGE } from './config';
import { App } from './ui/App';

import './styles/global.scss';

onDomReady(() => mountOnce({ id: SETTINGS_PAGE.rootId, node: <App /> }));
