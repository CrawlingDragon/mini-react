import { useEffect, useState } from 'react';
import './App.css';
let id = 0;
function App() {
  const [todoList, setTodoList] = useState([]);
  const [addValue, setAddValue] = useState('');
  function addValueChangeFn(e) {
    let val = e.target.value;
    setAddValue(val);
  }
  //add fn
  function addTodolist() {
    let newTodo = {
      id: (id += 1),
      text: addValue,
      state: 'cancel',
      isShow: true,
    };

    let newList = [...todoList, newTodo];
    setTodoList(newList);
    setAddValue('');
  }
  //save fn
  function saveTodolist() {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }
  useEffect(() => {
    let savedList = localStorage.getItem('todoList');
    if (savedList) {
      let list = JSON.parse(savedList);
      setTodoList(list);
      id = list.length;
    }
  }, []);
  // filter fn
  function filterTodoList(e, type) {
    let newList = [...todoList];
    newList.forEach((todo) => {
      if (type === 'all') {
        todo.isShow = true;
      } else if (type === 'done') {
        if (todo.state === 'done') {
          todo.isShow = true;
        } else {
          todo.isShow = false;
        }
      } else if (type === 'active') {
        if (todo.state === 'cancel') {
          todo.isShow = true;
        } else {
          todo.isShow = false;
        }
      }
    });
    setTodoList(newList);
  }

  function switchTodoState(e, todo, index) {
    let newList = [...todoList];
    newList[index].state = todo.state === 'cancel' ? 'done' : 'cancel';
    setTodoList(newList);
  }
  function removeTodo(todo) {
    let newList = [...todoList];
    newList = newList.filter((item) => item.id !== todo.id);
    setTodoList(newList);
  }
  return (
    <>
      <h2>todos</h2>
      <div>
        <input type="text" value={addValue} onChange={(e) => addValueChangeFn(e)} />
        <button onClick={addTodolist}>add</button>
        <button onClick={saveTodolist}>save</button>
      </div>
      <div>
        <input type="radio" name="state" onClick={(e) => filterTodoList(e, 'all')} defaultChecked />
        all
        <input type="radio" name="state" onClick={(e) => filterTodoList(e, 'done')} /> done
        <input type="radio" name="state" onClick={(e) => filterTodoList(e, 'active')} /> active
      </div>
      <ul>
        {todoList.map((todo, index) => {
          return (
            <li key={todo.id} style={{ display: todo.isShow ? 'block' : 'none' }}>
              {todo.text}
              <button onClick={() => removeTodo(todo)}>remove</button>
              <button onClick={(e) => switchTodoState(e, todo, index)}>
                {todo.state === 'cancel' ? 'done' : 'cancel'}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
