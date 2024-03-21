import React, { useState, useEffect } from 'react'
import './App.css'
import { CgAddR } from "react-icons/cg";
import { FiX, FiFilter } from "react-icons/fi";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDoc, getDocs, getFirestore, where } from "firebase/firestore";
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
  const [arr, setArr] = useState([]);
  const [filterOption, setFilterOption] = useState('all');

  useEffect(() => {
      getarrayfromfirebase();
  }, []);

  async function getarrayfromfirebase(){
    const q = query(collection(db, 'tasks'));
    const queryDocs = await getDocs(q);
    setArr(queryDocs.docs.map(
      doc => ({
        id: doc.id,
        date: doc.data().date,
        description: doc.data().description,
        isChecked: doc.data().isChecked
      })
    ));
  }
  async function updatearrfromfirebase(){
    const newArr = [];
    for (let i=0; i < arr.length; i++){
      const docRef = doc(db, 'tasks', arr[i].id);
      const document = await getDoc(docRef);
      console.log()
      if (document.exists){
        newArr.push({
          id: document.id,
          date: document.data().date,
          description: document.data().description,
          isChecked: document.data().isChecked
        })
      }
    }
    console.log(newArr);
    setArr([...newArr]);
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

  async function changeDescription(id, event) {
    event.preventDefault();
    try{
      const todoDocRef = doc(db, 'tasks', id);
      await updateDoc(todoDocRef, 
        {
          description: event.target.innerText
        }
      )
    } catch(err) {
      alert(err)
    }
    updatearrfromfirebase();
  }
  async function removeTodo(id, event) {
    event.preventDefault;
    try{
      const todoDocRef = doc(db, 'tasks', id);
      await deleteDoc(todoDocRef);
    } catch(err) {
      alert(err);
    }
    updatearrfromfirebase();
  }
  async function changeCheck(id, event) {
    event.preventDefault();
    const todoDocRef = doc(db, 'tasks', id);
    try{
      const document = await getDoc(todoDocRef);
      if (document.exists){
        await updateDoc(todoDocRef, 
          {
            isChecked: !document.data().isChecked
          }
        )
      }
    } catch(err) {
      alert(err)
    }
    updatearrfromfirebase();
  }
  function filterArray() {
    switch (filterOption) {
      case 'checked':
        return arr.filter(item => item.isChecked).sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1));
      case 'unchecked':
        return arr.filter(item => !item.isChecked).sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1));
      default:
        return arr;
    }
  }

  useEffect(
    () => {
      arr.sort((a, b) => (a.isChecked === b.isChecked ? 0 : a.isChecked ? 1 : -1));
    },
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
        <div class="checkbox-outer" onClick={(e) => changeCheck(item.id, e)}>
          <div class={item.isChecked? "checkbox-middle-checked" : "checkbox-middle-unchecked"}>
          </div>
        </div>
        <div class="todo-content">
        <h1 contentEditable="true" onBlur={(event) => changeDescription(item.id, event)} class="description">
          {item.description}
        </h1>
        <p class="date">{item.date}</p>
        </div>
        </div>
        <button onClick={(e) => removeTodo(item.id, e)} class="removeButton">
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
