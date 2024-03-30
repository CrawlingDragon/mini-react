import React from './core/React.js';

function Foo() {
  const [count, setCount] = React.useState(10);
  const [bar, setBar] = React.useState('bar');
  // let update = React.update();
  function handleClick() {
    setCount((count) => count);
    setBar('_room');
    // update();
  }

  return (
    <div>
      <h1>foo</h1>
      count://{count}
      <div>bar:// {bar}</div>
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
