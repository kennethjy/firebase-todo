import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [arr, setArr] = useState(() => {
    const storedArr = localStorage.getItem('myArr');
    return storedArr ? JSON.parse(storedArr) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('myArr', JSON.stringify(arr));
  }, [arr]);

  function appendlist() {
    const newItem = {
      date: new Date().toISOString().split('T')[0],
      description: "New Item",
      isChecked: false
    };
    setArr([...arr, newItem]);
  }

  function changeDescription(index, event) {
    const newArr = [...arr];
    newArr[index].description = event.target.innerText;
    setArr(newArr);
  }
  function removeTodo(index) {
    const newTodos = arr.filter((_, todoIndex) => todoIndex !== index);
    setArr(newTodos);
  }
  function changeCheck(index) {
    const newArr = [...arr];
    newArr[index].isChecked = !newArr[index].isChecked;
    setArr(newArr);
  }


  const renderedOutput = arr
  .sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1))
  .map((item, index) => (
      <div key={index} class="todo-item">
        <div class="left-todo">
        <div class="checkbox-outer" onClick={() => changeCheck(index)}>
          <div class={item.isChecked? "checkbox-middle-checked" : "checkbox-middle-unchecked"}>
          </div>
        </div>
        <div class="todo-content">
        <h1 contentEditable="true" onBlur={(event) => changeDescription(index, event)} class="description">
          {item.description}
        </h1>
        <p class="date">{item.date}</p>
        </div>
        </div>
        <button onClick={() => removeTodo(index)} class="removeButton">
          X
        </button>
    </div>
  ));

  

  return (
    <>
      <h1>To-do List</h1>
      <p>by: Kenneth Jayadi Yu 2602158260</p>
      <div class="todo-container">
        {renderedOutput}
        <div class="addButton" onClick={appendlist}>
          +
        </div>
      </div>
      
    </>
  )
}

export default App
