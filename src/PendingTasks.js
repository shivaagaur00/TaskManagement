import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { onValue, ref, update, set } from 'firebase/database';
import Sidebar from './sidebar';
import './App.css';

function PendingTasks() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = () => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          onValue(ref(db, `/${auth.currentUser.uid}`), (snapshot) => {
            const data = snapshot.val();
            let tasks = [];
            if (data !== null) {
              Object.values(data).forEach((task) => {
                if (task.text && task.deadline) {
                  const taskDeadline = new Date(task.deadline);
                  const currentDate = new Date();

                  if (!task.completed && taskDeadline < currentDate) {
                    const failedTaskRef = ref(db, `/${auth.currentUser.uid}/failedTasks/${task.uiduid}`);
                    set(failedTaskRef, task);

                    const taskRef = ref(db, `/${auth.currentUser.uid}/${task.uiduid}`);
                    update(taskRef, { completed: true, expired: true });
                  } else if (!task.completed) {
                    tasks.push(task);
                  }
                }
              });
            }
            setList(tasks);
            setLoading(false);
          });
        } else {
          navigate('/');
        }
      });
    };

    fetchTasks();
  }, [navigate]);

  const completeTask = (taskId) => {
    const taskRef = ref(db, `/${auth.currentUser.uid}/${taskId}`);
    update(taskRef, { completed: true })
      .then(() => {
        setList((prevList) => prevList.filter((task) => task.uiduid !== taskId));
      })
      .catch((err) => {
        console.error('Error completing task:', err);
      });
  };

  return (
    <div className='toColor'>
      <div className="main-container">
        <Sidebar />
        <div className="content">
          <h2>Pending Tasks</h2>
          {loading ? (
            <p>Loading tasks...</p>
          ) : list.length === 0 ? (
            <p>No tasks for now</p>
          ) : (
            <div className="tasks-list">
              {list.map((task) => (
                <div key={task.uiduid} className="task">
                  <h3>{task.text}</h3>
                  <p>Deadline: {task.deadline}</p>
                  <button onClick={() => completeTask(task.uiduid)} className="complete-btn">
                    Complete Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PendingTasks;
