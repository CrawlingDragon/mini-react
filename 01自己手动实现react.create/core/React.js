export function createTextNode(text) {
  return {
    type: 'TEXT_ELEMTNT',
    nodeValue: text,
    props: {
      children: [],
    },
  };
}
export function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        return typeof child === 'string' ? createTextNode(child) : child;
      }),
    },
  };
}
function render(el, container) {
  const dom =
    el.type === 'TEXT_ELEMTNT' ? document.createTextNode('') : document.createElement(el.type);
  Object.keys(el.props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = el.props[key];
    }
  });
  el.props.children.forEach((child) => {
    console.log('child', child);
    // console.log('dom', dom);
    // dom.nodeValue = child.nodeValue;

    render(child, dom);
  });
  // console.log('container', container);
  if (el.type === 'TEXT_ELEMTNT') {
    dom.nodeValue = el.nodeValue;
  }
  container.appendChild(dom);
}
const React = { createElement, render };

export default React;
