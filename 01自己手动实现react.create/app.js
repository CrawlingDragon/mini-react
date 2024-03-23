import { createElement, createTextNode } from './react-core/index.js';

let text = createTextNode('app');
const app = createElement('div', { id: 'app' }, text);
export default app;
