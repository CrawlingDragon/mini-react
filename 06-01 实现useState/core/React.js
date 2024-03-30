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
let currentRoot = null;
let nextWorkOfUnit = null;
let deletions = []; // 用来记录需要删除的fiber
let wipFiber = null;
function render(el, container) {
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
function propsUpdate(dom, nextProps, prevProps) {
  // Object.keys(nextProps).forEach((key) => {
  //   if (key !== 'children') {
  //     if (key.startsWith('on')) {
  //       console.log('fiber.props[key]', nextProps[key]);
  //       dom.addEventListener(key.toLowerCase().slice(2), nextProps[key]);
  //     } else {
  //       dom[key] = nextProps[key];
  //     }
  //   }
  // });
  // console.log('prevProps', prevProps);
  // 1.旧的有，新的没有，删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== 'children') {
      if (!(key in nextProps)) {
        dom.removeAttribute(key);
      }
    }
  });
  Object.keys(nextProps).forEach((key) => {
    if (key !== 'children') {
      if (nextProps[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          // console.log('fiber.props[key]', nextProps[key]);

          dom.removeEventListener(key.toLowerCase().slice(2), prevProps[key]);
          dom.addEventListener(key.toLowerCase().slice(2), nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });
  // 2.旧的没有，新的也有
  // 3.旧的有，新的也有，但是不一样
}
function initChild(fiber, children) {
  // 4.转换链表
  // let children = fiber.props.children;
  let prevChild = null;
  let oldFiber = fiber.alternate && fiber.alternate.child;

  let newFiber;
  children.forEach((child, index) => {
    // isSame = true ,代表是更新，否则是新增
    const isSame = oldFiber && oldFiber.type === child.type;
    if (isSame) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        sibling: null,
        child: null,
        dom: oldFiber.dom,
        alternate: oldFiber,
        effectTag: 'update',
      };
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          props: child.props,
          parent: fiber,
          sibling: null,
          child: null,
          effectTag: 'placement',
        };
      }

      if (oldFiber) {
        deletions.push(oldFiber);
      }
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }
    if (index == 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    if (newFiber) {
      prevChild = newFiber;
    }
  });
  // 5.处理剩余的老节点
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  // 1.执行函数，得到children
  wipFiber = fiber;
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
    propsUpdate(dom, fiber.props, {});
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
// 删除旧节点
function commitDeletion(fiber) {
  if (fiber.dom) {
    fiber.parent.dom.removeChild(fiber.dom);
  } else {
    // 如果fiber没有dom，则说明它是一个function component，需要一直向上找parent，直到找到一个有dom的父节点
    let parent = fiber.parent;
    while (!parent.dom) {
      parent = parent.parent;
    }
    parent.dom.removeChild(fiber.child.dom);
  }
}
//添加到根元素，也就是统一提交
function commitRoot() {
  deletions.forEach(commitDeletion);
  commitWork(root.child); // 第一次提价 应该是根元素的第一个子元素，也就是root的child
  currentRoot = root;
  root = null; // 重置root 为null，之后的commitRoot调用不会再执行
  deletions = [];
}
function commitWork(fiber) {
  if (!fiber) return;
  // 如果fiber的父节点没有dom，则一直往上找，直到找到一个有dom的父节点
  let fiberParent = fiber.parent;
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  if (fiber.effectTag === 'update') {
    //表示更新
    propsUpdate(fiber.dom, fiber.props, fiber.alternate.props);
  } else if (fiber.effectTag === 'placement') {
    // fiber有dom，才把dom插入到父节点的dom内，避免把 function component 插入到fiberParent.dom内
    if (fiber.dom) {
      fiberParent.dom.append(fiber.dom);
    }
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(IdleDeadline) {
  let shouldYeid = false;
  while (!shouldYeid && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    if (root?.sibling?.type === nextWorkOfUnit?.type) {
      nextWorkOfUnit = undefined;
    }

    shouldYeid = IdleDeadline.timeRemaining() < 1;
  }

  // nextWorkOfUnit == undefined  说明vdom树已经全部处理完毕,做最后的统一提交
  if (nextWorkOfUnit == undefined && root) {
    // vdom渲染完毕，也就是nextWorkOfUnit == undefined时，做一次递归dom插入
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function update() {
  let currentFiber = wipFiber;
  return () => {
    console.log('currentFiber', currentFiber);
    nextWorkOfUnit = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // console.log('update');
    root = nextWorkOfUnit;
  };
}
let stateHooks = [];
let stateHookIndex = 0;
function useState(initial) {
  let currentFiber = wipFiber;
  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];
  const stateHook = {
    state: oldHook ? oldHook.state : initial,
    queue: oldHook ? oldHook.queue : [],
  };

  // 批量调用stateHook内的queue
  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  });
  stateHook.queue = [];

  stateHookIndex++;
  stateHooks.push(stateHook);
  // 把心的stateHook挂载到currentFiber上
  currentFiber.stateHooks = stateHooks;
  const setState = (action) => {
    // 优化，如果值和上一个值一样，则不更新
    const eagerState = typeof action === 'function' ? action(stateHook.state) : action;
    if (eagerState === stateHook.state) return;
    // stateHook.state = action(stateHook.state);
    stateHook.queue.push(typeof action === 'function' ? action : () => action);
    console.log('11');
    nextWorkOfUnit = {
      ...currentFiber,
      alternate: currentFiber,
    };
    // console.log('update');
    root = nextWorkOfUnit;
  };

  return [stateHook.state, setState];
}
const React = { createElement, render, update, useState };

export default React;
