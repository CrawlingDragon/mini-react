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
        // console.log('child', child);
        const isTextNode = typeof child === 'string' || typeof child === 'number';
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

let root = null;
let nextWorkOfUnit = null;
function render(el, container) {
  console.log('typeof el', typeof el);

  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  root = nextWorkOfUnit;
}
function createDom(type) {
  return type === 'TEXT_ELEMTNT' ? document.createTextNode('') : document.createElement(type);
}
function propsUpdate(dom, fiber) {
  Object.keys(fiber.props).forEach((key) => {
    if (key !== 'children') {
      dom[key] = fiber.props[key];
    }
  });
}
function initChild(fiber, children) {
  // 4.转换链表
  // let children = fiber.props.children;
  let prevChild = null;

  children.forEach((child, index) => {
    let newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      sibling: null,
      child: null,
    };
    if (index == 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initChild(fiber, children);
}
function updateHostComponent(fiber) {
  // 1.创建dom
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    // 2.把dom添加到parent内
    // fiber.parent.dom.appendChild(dom);
    // 3.处理props
    propsUpdate(dom, fiber);
  }
  const children = fiber.props.children;
  initChild(fiber, children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  //5.返回下一个workOfUnit
  if (fiber.child) {
    return fiber.child;
  }
  // if (fiber.sibling) {
  //   return fiber.sibling;
  // }
  let nextFiber = fiber;
  // 下面的while循环其实是两个内容，一个是返回fiber的sibiling，一个是一直向上找，返回fiber的parent的sibling,
  while (nextFiber) {
    if (nextFiber.sibling) {
      // 返回当前fiber的sibling
      return nextFiber.sibling;
    }
    // 如果fiber的parent没有sibling，则一直往上找，直到找到一个有sibling的父节点
    nextFiber = nextFiber.parent;
  }
  // return fiber.parent?.sibling;
}

//添加到根元素，也就是统一提交
function commitRoot() {
  commitWork(root.child); // 第一次提价 应该是根元素的第一个子元素，也就是root的child
  root = null; // 重置root 为null，之后的commitRoot调用不会再执行
}
function commitWork(fiber) {
  if (!fiber) return;

  // 如果fiber的父节点没有dom，则一直往上找，直到找到一个有dom的父节点
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  // fiber有dom，才把dom插入到父节点的dom内，避免把 function component 插入到fiberParent.dom内
  if (fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(IdleDeadline) {
  let shouldYeid = false;

  while (!shouldYeid && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    shouldYeid = IdleDeadline.timeRemaining() < 1;
  }

  // nextWorkOfUnit == undefined  说明vdom树已经全部处理完毕,做最后的统一提交
  if (nextWorkOfUnit == undefined && root) {
    // vdom渲染完毕，也就是nextWorkOfUnit == undefined时，做一次递归dom插入
    commitRoot();
    return;
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop, { timeout: 5000 });

const React = { createElement, render };

export default React;
