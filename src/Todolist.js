import React, { useEffect, useState } from 'react';
import { auth,db } from './firebase';
import { signOut,onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { uid } from 'uid';
import {set,ref, onValue,remove} from 'firebase/database';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import './todolist.css'
function TodoList() {
    const [text, setText] = useState('');
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(()=>{
        auth.onAuthStateChanged((user)=>{
            if(user){
                onValue(ref(db,`/${auth.currentUser.uid}`),(snapshot)=>{
                    setList([]);
                    const data = snapshot.val();
                    if(data!==null){
                        Object.values(data).map((text)=>{
                            setList((oldArr)=>[...oldArr,text]);
                        });
                    }
                });
            }
            else if(!user){
                navigate('/');
            }
        })
    },[]);
    
    const addtofirebase=()=>{
        const uiduid = uid();
        set(ref(db,`/${auth.currentUser.uid}/${uiduid}`),{
            text:text,
            uiduid:uiduid,
        })
    }

    const deletetext=(uid)=>{
        remove(ref(db,`/${auth.currentUser.uid}/${uid}`));
    }



    const signout = ()=>{
        signOut(auth).then(()=>{
            navigate('/');
        }).catch((err)=>alert("error"));
    }

    return (
        <div className='todolist'>
                <div className='inputtext'>
                <input
                    type='text'
                    placeholder='enter the text'
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                />
                <button onClick={addtofirebase}><AddIcon fontSize='large'></AddIcon></button>
                </div>
            <div className='list'>
                {list.map(text=>(
                    <div className='text'>
                        <h1 className='listtext'>{text.text}</h1>
                        <button onClick={()=>deletetext(text.uiduid)}><DeleteForeverIcon></DeleteForeverIcon></button>
                    </div>
                ))}
                
            </div>
            
            <div className='signout'>
                <LogoutIcon className='icon' onClick={signout}></LogoutIcon>
            </div>
        </div>
    );
}

export default TodoList;
