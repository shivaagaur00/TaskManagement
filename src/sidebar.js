import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import './sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email || "Guest");
      } else {
        setUserEmail("");
      }
    });
    return () => unsubscribe();
  }, []);

  const signout = () => {
    auth.signOut()
      .then(() => {
        navigate('/');
      })
      .catch(() => alert("Error signing out"));
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h3>TaskManager</h3>
      </div>
      <div className="user-info">
        <div className="profile">
          <img
            alt="profile"
            src="https://api.multiavatar.com/Binx Bond.svg"
            className="profile-img"
          />
          <p className='mail'>{userEmail || "Loading..."}</p>
        </div>
        <div>
          <button className="sidebar-button" onClick={() => navigate('/todolist')}>Add Task</button>
          <button className="sidebar-button" onClick={() => navigate('/pending')}>Pending Tasks</button>
          <button className="sidebar-button" onClick={() => navigate('/completed')}>Completed Tasks</button>
          <button className="sidebar-button" onClick={() => navigate('/progress')}>Progress</button>
          <button className="sidebar-button" onClick={() => navigate('/failed-tasks')}>Expired task</button>
        </div>
        <button className="logout-button" onClick={signout}>Logout</button>
      </div>
    </div>
  );
}

export default Sidebar;
