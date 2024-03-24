import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import AccountDrawer from './Account';
import './App.css'
import { CgAddR } from "react-icons/cg";
import { FiX, FiFilter } from "react-icons/fi";
// Import the functions you need from the SDKs you need
import { App, Auth } from './FirebaseApp';
import { getAnalytics } from "firebase/analytics"; 
import  { collection, 
          getDoc, getDocs, getFirestore, 
          doc, addDoc, updateDoc, deleteDoc, 
          query, where, orderBy, onSnapshot } from "firebase/firestore"
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Initialize Firebase


function Todo() {
  const app = App();
  const db = getFirestore(app);
  const auth = Auth();
  const navigate = useNavigate();
  const [arr, setArr] = useState([]);
  const [filterOption, setFilterOption] = useState('all');
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState("")
    async function getUser(){
            const q = query(collection(db, 'users'), where("uid", "==", user.uid));
            const userDocs = await getDocs(q);
            const userDoc = await getDoc(userDocs.docs[0].ref);
            setUserData(userDoc.data());
    }

  useEffect(() => {
    if (!user) { 
      console.log(user,loading,error);
      navigate("/");
    }
    }, [user]);

  useEffect(() => {
      setarrayfromfirebase();
      getUser();
      console.log('aaa')
  }, []);
  
  async function setarrayfromfirebase(){
    const q = query(collection(db, 'tasks'), where("uid", "==", user.uid));
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
      if (document.data() != undefined){
        newArr.push({
          id: document.id,
          date: document.data().date,
          description: document.data().description,
          isChecked: document.data().isChecked
        })
      }
      
    }
    setArr([...newArr]);
  } 

  
  

  const addtoDB = async (e) => {
    e.preventDefault()
    try{
      const docRef = await addDoc(collection(db, 'tasks'), 
        {
          date: new Date().toISOString().split('T')[0],
          description: "New Item",
          isChecked: false,
          uid: user.uid
        }
      )
      const document = await getDoc(docRef);
      const newArr = [...arr];
      newArr.push({
        id: document.id,
        date: document.data().date,
        description: document.data().description,
        isChecked: document.data().isChecked,
        uid: user.uid
      })
      setArr([...newArr]);
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
      const newArr = [...arr];
      for (let i=0; i < newArr.length; i++){
        if (newArr[i].id == id){
          newArr[i].description = event.target.innerText;
          setArr([...newArr])
          break;
        }
      }
    } catch(err) {
      alert(err)
    }
  }
  async function removeTodo(id, event) {
    event.preventDefault;
    try{
      const todoDocRef = doc(db, 'tasks', id);
      await deleteDoc(todoDocRef);
      const newArr = arr.filter((item) => item.id !== id);
      setArr(newArr);
    } catch(err) {
      alert(err);
    }
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
        for (let i=0; i < newArr.length; i++){
          if (newArr[i].id == id){
            newArr[i].isChecked = !newArr[i].isChecked;
            setArr([...newArr])
            break;
          }
        }
      }
    } catch(err) {
      alert(err)
    }
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
      updatearrfromfirebase();
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
    <div className='todo-container'>
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
    </div>
  ));
    
  

  return (
    <>
      <div class="todo-container">
      <AccountDrawer />
      <h1>{userData.name? userData.name + "'s To-do List" : "To-do List"}</h1>
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
