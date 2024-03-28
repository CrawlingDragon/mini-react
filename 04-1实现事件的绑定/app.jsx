import React from './core/React.js';

// const app = React.createElement('div', { id: 'app' }, 'haha-', 'hehe');
let count = 99;
function handleClick() {
  console.log('click');
  count++;
  React.update();
}
function Count({ num }) {
  return (
    <div id="count" onClick={handleClick}>
      count:{count}
    </div>
  );
}
const App = (
  <div>
    <div id="parent-div">
      haha
      <Count num={10} />
      {/* <Count num={20} /> */}
    </div>
  </div>
);
//  return /* @__PURE__ */ React.createElement("div", { id: "my-mini" }, "haha ");

// console.log('appJsx', appJsx);
// console.log('app :>> ', App);

export default App;
