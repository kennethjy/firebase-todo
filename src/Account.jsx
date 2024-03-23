import React, { useState, useEffect } from 'react';
import './App.css'; // Import CSS for styling
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth, signOut } from 'firebase/auth';
import { App, Auth } from './FirebaseApp';
import { useNavigate } from 'react-router-dom';



function AccountDrawer(){
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
      setIsOpen(!isOpen);
    }; 

    const logout = () => {
        signOut(Auth())
    }
  
    return (
      <div>
        <button onClick={toggleDrawer} className="openBtn">Open Drawer</button>
        <div className={`drawer ${isOpen ? 'active' : ''}`}>
          <button onClick={toggleDrawer} className="closeBtn">Close Drawer</button>
          <p>This is the content inside the drawer.</p>
          <p>Click outside this box to close the drawer.</p>
          <button onClick={logout} className="closeBtn">Sign Out</button>
        </div>
        <div className={`overlay ${isOpen ? 'active' : ''}`} onClick={toggleDrawer}></div>
      </div>
    );
};

export default AccountDrawer;
