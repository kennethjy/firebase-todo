import React, { useState, useEffect } from 'react'
import plus from './plus.png'
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
      description: "New Item"
    };
    setArr([...arr, newItem]);
  }

  function handleChange(index, event) {
    const newArr = [...arr];
    newArr[index].description = event.target.innerText;
    setArr(newArr);
  }
  function removeTodo(index) {
    const newTodos = arr.filter((_, todoIndex) => todoIndex !== index);
    setArr(newTodos);
  }

  const renderedOutput = arr.map((item, index) => (
      <div key={index} class="todo-item">
        <button onClick={() => removeTodo(index)} class="removeButton">X</button>
        <h1 contentEditable="true" onBlur={(event) => handleChange(index, event)} class="description">
          {item.description}
        </h1>
        <p class="date">{item.date}</p>
    </div>
  ));

  

  return (
    <>
      <h1>To-do List</h1>
      <p>by: Kenneth Jayadi Yu 2602158260</p>
      <div class="todo-container">
        {renderedOutput}
        <div class="addButton" onClick={appendlist}>
          <img src='/plus.png'></img>
        </div>
      </div>
      
    </>
  )
}

export default App
