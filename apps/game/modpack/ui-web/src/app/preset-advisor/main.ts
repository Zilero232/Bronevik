import { onDomReady } from '../../shared/lib/dom/on-dom-ready';
import { startPresetAdvisor } from './lib/preset-advisor';

onDomReady(() => startPresetAdvisor(window));
