import app from './app.js';
import ReactDom from './core/ReactDom.js';

ReactDom.createRoot(document.querySelector('#root')).render(app);

function task(IdleDeadline) {
  // 逻辑的简单解释
  // 浏览器在空闲的时候，运行task
  // 一开始 shouldYield 为false，进入while循环，while循环内，如果timeRemaining>1 有空闲，则继续执行requestIdleCallback，在执行requesIdleCallback之前，如果timeRamaining < 1，shouldYield则会变为true，继续requestIdleCallback（task）执行，反之则为false，继续while虚幻
  let shouldYeid = false;
  while (!shouldYeid) {
    shouldYeid = IdleDeadline.timeRemaining() < 1;
    requestIdleCallback(task);
  }
}
requestIdleCallback(task, { timeout: 5000 });
