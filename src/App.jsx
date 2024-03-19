import React, { useState, useEffect } from 'react'
import './App.css'
import { CgAddR } from "react-icons/cg";
import { FiX, FiFilter } from "react-icons/fi";

function App() {
  const [count, setCount] = useState(0)
  const [arr, setArr] = useState(() => {
    const storedArr = localStorage.getItem('myArr');
    return storedArr ? JSON.parse(storedArr) : [];
  });
  const [filterOption, setFilterOption] = useState('all');
  
  useEffect(() => {
    localStorage.setItem('myArr', JSON.stringify(arr));
  }, [arr]);

  useEffect(() => {
    const storedArr = JSON.parse(localStorage.getItem('myArr'));
    if (storedArr) {
      const sortedArr = storedArr.sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1));
      setArr(storedArr);
    }
  }, []);

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
  function filterArray() {
    switch (filterOption) {
      case 'checked':
        return arr.filter(item => item.isChecked);
      case 'unchecked':
        return arr.filter(item => !item.isChecked);
      default:
        return arr;
    }
  }

  useEffect(
    () => {arr.sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1))},
    [filterOption]
  )

  // JSX for the filter module
  const filterModule = (
    <div class="filter">
      <FiFilter size={30}/>
      <select class="select-dropdown" value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
        <option value="all">Show All</option>
        <option value="checked">Show Checked</option>
        <option value="unchecked">Show Unchecked</option>
      </select>
    </div>
  );

  // Filter the array based on the filter option
  const filteredArr = filterArray();

  const renderedOutput = filteredArr.map((item, index) => (
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
          <FiX size={30}/>
        </button>
    </div>
  ));

  

  return (
    <>
      <div class="todo-container">
      <h1>To-do List</h1>
      <p>by: Kenneth Jayadi Yu 2602158260</p>
        {filterModule}
        {renderedOutput}
        <div class="addButton" onClick={appendlist}>
          <CgAddR size={30}/>
        </div>
      </div>
      
    </>
  )
}

export default App
