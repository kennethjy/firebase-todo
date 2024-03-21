import React, { useState, useEffect } from 'react'
import './App.css'
import { CgAddR } from "react-icons/cg";
import { FiX, FiFilter } from "react-icons/fi";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, onSnapshot } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtJHtSpl5gsDmZf8XE2U0797ndIDXg7qU",
  authDomain: "vite-test-projectt.firebaseapp.com",
  projectId: "vite-test-projectt",
  storageBucket: "vite-test-projectt.appspot.com",
  messagingSenderId: "730310663151",
  appId: "1:730310663151:web:d146930488431b9381f41a",
  measurementId: "G-QFVDF4MB23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

function Todo() {
  const [arr, setArr] = useState(() => {
    const storedArr = localStorage.getItem('myArr');
    return storedArr ? JSON.parse(storedArr) : [];
  });
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
    getarrayfromfirebase()
  }, []);

  function getarrayfromfirebase(){
    const q = query(collection(db, 'tasks'));
    onSnapshot(q, (querySnapshot) => {
      setArr(querySnapshot.docs.map(
        doc => ({
          id: doc.id,
          date: doc.data().date,
          description: doc.data().description,
          isChecked: doc.data().isChecked
        })
      ))
    })
    console.log(arr);
  }

  function getsortedarrayfromfirebase(){
    const q = query(collection(db, 'tasks'), orderBy('isChecked', 'asc'));
    onSnapshot(q, (querySnapshot) => {
      setArr(querySnapshot.docs.map(
        doc => ({
          id: doc.id,
          date: doc.data().date,
          description: doc.data().description,
          isChecked: doc.data().isChecked
        })
      ))
    })
    console.log(arr);
  }

  const addtoDB = async (e) => {
    e.preventDefault()
    try{
      await addDoc(collection(db, 'tasks'), 
        {
          date: new Date().toISOString().split('T')[0],
          description: "New Item",
          isChecked: false
        }
      )
    } catch(err) {
      alert(err)
    }
  }

  async function changeDescription(index, event) {
    event.preventDefault()
    const todoDocRef = doc(db, 'tasks', arr[index].id)
    try{
      await updateDoc(todoDocRef, 
        {
          description: event.target.innerText
        }
      )
    } catch(err) {
      alert(err)
    }
  }
  async function removeTodo(index) {
    const todoDocRef = doc(db, 'tasks', arr[index].id)
    try{
      await deleteDoc(todoDocRef)
    } catch(err) {
      alert(err)
    }
  }
  async function changeCheck(index, event) {
    event.preventDefault()
    const todoDocRef = doc(db, 'tasks', arr[index].id)
    try{
      await updateDoc(todoDocRef, 
        {
          isChecked: !arr[index].isChecked
        }
      )
    } catch(err) {
      alert(err)
    }
  }
  function filterArray() {
    console.log(arr)
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
        <div class="checkbox-outer" onClick={(e) => changeCheck(index, e)}>
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
        <div class="addButton" onClick={addtoDB}>
          <CgAddR size={30}/>
        </div>
      </div>
      
    </>
  )
}

export default Todo
