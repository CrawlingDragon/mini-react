import React from './core/React.js';

// const app = React.createElement('div', { id: 'app' }, 'haha-', 'hehe');
let count = 99;

function Counter({ num }) {
  function handleClick() {
    console.log('click :>> ');
    count++;
    console.log('count :>> ', count);
    React.update();
  }
  return (
    <div>
      count:{count}
      <button id="count" onClick={handleClick}>
        button
      </button>
    </div>
  );
}
const App = (
  <div>
    <div id="parent-div">
      haha
      <Counter num={10} />
      {/* <Count num={20} /> */}
    </div>
  </div>
);
//  return /* @__PURE__ */ React.createElement("div", { id: "my-mini" }, "haha ");

// console.log('appJsx', appJsx);
// console.log('app :>> ', App);

export default App;
