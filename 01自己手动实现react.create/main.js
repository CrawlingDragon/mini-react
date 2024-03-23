// 第一种 : 用dom api写死的方式
// let dom = document.createElement('div');
// dom.id = 'app';
// document.body.appendChild(dom);

// const textNode = document.createTextNode('');
// textNode.nodeValue = 'app';
// dom.appendChild(textNode);

// 第二种：react -》 虚拟dom

// function createTextNode(text) {
//   return {
//     type: 'TEXT_ELEMTNT',
//     nodeValue: text,
//   };
// }

// let text = {
//   type: 'TEXT_ELEMTNT',
//   nodeValue: 'app',
//   props: [],
// };
// const el = {
//   type: 'div',
//   props: {
//     id: 'app',
//     children: [text],
//   },
// };
// let dom = document.createElement(el.type);
// dom.id = el.props.id;
// document.querySelector('#root').appendChild(dom);

// const textNode = document.createTextNode('');
// textNode.nodeValue = text.nodeValue;
// // const app = createElement('div', { id: 'app' }, text);
// document.body.appendChild(dom);
// dom.appendChild(textNode);

// // 第三种动态创建
// function createTextNode(text) {
//   return {
//     type: 'TEXT_ELEMTNT',
//     nodeValue: text,
//     props: [],
//   };
// }
// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
//       children,
//     },
//   };
// }
// let text_el = createTextNode('app');
// const app = createElement('div', { id: 'app' }, text_el);
// let dom = document.createElement(app.type);
// dom.id = app.props.id;
// document.querySelector('#root').appendChild(dom);

// const textNode = document.createTextNode('');
// textNode.nodeValue = text_el.nodeValue;
// dom.appendChild(textNode);

// 第四种，再次进化，动态创建，因为 append 步骤相同，可以用递归方式append

// let text_el = createTextNode('app');
// const app = createElement('div', { id: 'app' }, text_el);
// let dom = document.createElement(app.type);
// dom.id = app.props.id;
// document.querySelector('#root').appendChild(dom);

// const textNode = document.createTextNode('');
// textNode.nodeValue = text_el.nodeValue;
// dom.appendChild(textNode);

import app from './app.js';
import ReactDom from './react-dom/client.js';
console.log('app', app);

ReactDom.createRoot(document.querySelector('#root')).render(app);
