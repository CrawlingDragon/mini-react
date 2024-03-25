import React from './core/React.js';

// const app = React.createElement('div', { id: 'app' }, 'haha-', 'hehe');
function Count({ num }) {
  return <div id="count">count:{num}</div>;
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
