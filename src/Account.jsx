import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS for styling
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import { App, Auth } from './FirebaseApp';
import { collection, getFirestore, query, where, getDocs, getDoc, deleteDoc} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';



function AccountDrawer(){
    const [isOpen, setIsOpen] = useState(false);
    const auth = Auth();
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);
    const db = getFirestore(App());
    const [userData, setUserData] = useState("")
    async function getUser(){
            const q = query(collection(db, 'users'), where("uid", "==", user.uid));
            const userDocs = await getDocs(q);
            const userDoc = await getDoc(userDocs.docs[0].ref);
            setUserData(userDoc.data());
    }

    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    }; 

    const logout = () => {
        signOut(Auth())
    }

    const deleteAccount = async () => {
        await auth.currentUser.delete();
        const q1 = query(collection(db, 'users'), where("uid", "==", user.uid));
        const userDocs = await getDocs(q1);
        deleteDoc(userDocs.docs[0].ref);
        const q = query(collection(db, 'tasks'), where("uid", "==", user.uid));
        const queryDocs = await getDocs(q);
        for (let i=0; i<queryDocs.size; i++){
            deleteDoc(queryDocs.docs[i].ref);
        }
        logout();
        navigate("/");

    }
    getUser()
    
    return (
      <div>
        <button onClick={toggleDrawer} className="openBtn">Account</button>
        <div className={`drawer ${isOpen ? 'active' : ''}`}>
          <h1>{userData.name}</h1>
          <p>{userData.email}</p>
          <button onClick={logout} className="closeBtn">Sign Out</button>
          <p></p>
          <button onClick={deleteAccount} className="closeBtn del">Delete Account</button>
        </div>
        <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleDrawer}></div>
      </div>
    );
};

export default AccountDrawer;
