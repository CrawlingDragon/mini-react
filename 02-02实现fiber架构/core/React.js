export function createTextNode(text) {
  return {
    type: 'TEXT_ELEMTNT',

    props: { nodeValue: text, children: [] },
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

let nextWorkOfUnit = null;
function render(el, container) {
  // console.log('el', el);
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // const dom =
  //   el.type === 'TEXT_ELEMTNT' ? document.createTextNode('') : document.createElement(el.type);
  // Object.keys(el.props).forEach((key) => {
  //   if (key !== 'children') {
  //     dom[key] = el.props[key];
  //   }
  // });
  // el.props.children.forEach((child) => {
  //   // console.log('child', child);
  //   // console.log('dom', dom);
  //   // dom.nodeValue = child.nodeValue;
  //   render(child, dom);
  // });
  // // console.log('container', container);
  // if (el.type === 'TEXT_ELEMTNT') {
  //   dom.nodeValue = el.nodeValue;
  // }
  // container.appendChild(dom);
}
function createDom(type) {
  return type === 'TEXT_ELEMTNT' ? document.createTextNode('') : document.createElement(type);
}
function propsUpdate(dom, work) {
  Object.keys(work.props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = work.props[key];
    }
  });
}
function initChild(fiber) {
  // 4.转换链表
  let children = fiber.props.children;
  let prevChild = null;

  children.forEach((child, index) => {
    let newWork = {
      type: child.type,
      props: child.props,
      parent: fiber,
      sibling: null,
      child: null,
      nodeValue: child.nodeValue,
    };
    if (index == 0) {
      fiber.child = newWork;
    } else {
      prevChild.sibling = newWork;
    }
    prevChild = newWork;
  });

  //5.返回下一个workOfUnit
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent.sibling;
}
function performWorkOfUnit(fiber) {
  // 1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    // 2.把dom添加到parent内
    fiber.parent.dom.appendChild(dom);
    // 3.处理props
    propsUpdate(dom, fiber);
  }
  return initChild(fiber);
}

function workLoop(IdleDeadline) {
  let shouldYeid = false;
  while (!shouldYeid && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYeid = IdleDeadline.timeRemaining() < 1;
    requestIdleCallback(workLoop);
  }
}
requestIdleCallback(workLoop, { timeout: 5000 });

const React = { createElement, render };

export default React;
