import React from './core/React.js';

// function A() {
//   return <div>A</div>;
// }
function B() {
  return <div>Basdf</div>;
}
let show = false;
function Btn() {
  const A = <div>Asdf</div>;
  // const B = <p>Bhgg</p>;

  function handleClick() {
    console.log('click');
    // show = !show;
    // React.update();
  }
  return (
    <div>
      <button onClick={handleClick}>切换</button>
      {show && A}
    </div>
  );
}
const App = (
  <div>
    <div id="parent-div">haha</div>
    <Btn></Btn>
  </div>
);

//  return /* @__PURE__ */ React.createElement("div", { id: "my-mini" }, "haha ");

// console.log('appJsx', appJsx);
// console.log('app :>> ', App);

export default App;
