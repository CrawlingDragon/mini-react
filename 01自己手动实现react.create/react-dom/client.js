function render(el, container) {
  console.log('el', el);
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

// import render from '../react-dom/client.js';

const ReactDom = {
  createRoot(container) {
    return {
      render(app) {
        return render(app, container);
      },
    };
  },
};
export default ReactDom;
