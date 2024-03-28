import React from './core/React.js';

let countFoo = 1;
function Foo() {
  console.log('foo rerun :>> ');
  let update = React.update();
  function handleClick() {
    countFoo++;
    update();
  }

  return (
    <div>
      <h1>foo</h1>
      {countFoo}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let countBar = 1;
function Bar() {
  console.log('boo rerun :>> ');
  let update = React.update();
  function handleClick() {
    countBar++;
    update();
  }

  return (
    <div>
      <h1>bar</h1>
      {countBar}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

let currentRoot = 1;
// function App() {
//   console.log('app rerun');
//   function handleClick() {
//     currentRoot++;
//     React.update();
//   }

//   return (
//     <div>
//       {/* <Foo></Foo>
//       <Bar></Bar> */}
//       hi, {currentRoot}
//       <button onClick={handleClick}>click</button>
//     </div>
//   );
// }
console.log('app rerun');
let update = React.update();
function handleClick() {
  currentRoot++;
  update();
}
const App = (
  <div>
    hi, {currentRoot}
    <button onClick={handleClick}>click</button>
    <Foo></Foo>
    <Bar></Bar>
  </div>
);

//  return /* @__PURE__ */ React.createElement("div", { id: "my-mini" }, "haha ");

// console.log('appJsx', appJsx);
// console.log('app :>> ', App);

export default App;
