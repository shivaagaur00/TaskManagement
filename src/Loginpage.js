import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword , signInAnonymously, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

import './Loginpage.css';
function Loginpage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword,setConfirmPassword] = useState('');
    const [regestered,setRegestered] = useState(true);
    const navigate = useNavigate();

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                navigate('./todolist');
            })
            .catch((err) => {
                if(email.includes("gmail.com") || email.includes(".ac.in")){
                    const element = document.getElementById('passworderror');
                    element.style.display='block';
                } else{
                    const element = document.getElementById('emailerror');
                    element.style.display='block';
                }
            });
    }

    const handleRegester = ()=>{
        if(password.length>=6 && password===confirmPassword){
        createUserWithEmailAndPassword(auth,email,password).then(()=>{
            navigate('./todolist');
            setPassword('');
            setEmail('');
        }).catch((err)=>{
            alert("An account already exists with this email");
        });
    }
    if(email.includes("gmail.com") || email.includes(".ac.in")){


        if(password.length<6){
            const element = document.getElementById('passworderror');
            element.style.display='block';
        }

        if(password!==confirmPassword){
            const element = document.getElementById('passworderror2');
            element.style.display='block';
        }
    } else{
        const element = document.getElementById('emailerror');
        element.style.display='block';
    }
    
    }

    const goBack=()=>{
        setEmail('');
        setPassword('');
        setRegestered(true);
    }

    const handleAnomonousLogin=()=>{
        signInAnonymously(getAuth()).then(()=>{
            navigate('./todolist');
        }).catch((error)=>alert("Error"));
    }

    const forgetpassword=()=>{
        sendPasswordResetEmail(getAuth(),email).then(()=>{
            const element = document.getElementById('resetpassword');
            element.style.display='block';
        }).catch((err)=>{
            alert("Please Provide the correct email.");
        });
    }

    return (
        <div className='Loginpage'>
            
            {regestered ?(<>
            <h1>Log-in</h1>
            <div className='input'>
            <MailOutlineIcon className='icons'></MailOutlineIcon>
            <input type='email' placeholder='Enter your Email' onChange={(e) => setEmail(e.target.value)} value={email} id='email'></input>
            </div>
            <p id='emailerror'>* Sorry,the email you entered is incorrect. Please provide the correct email address.</p>

            <div className='input'>
            <LockOpenIcon className='icons'></LockOpenIcon>
            <input type='password' placeholder='Enter the Password' onChange={(e) => setPassword(e.target.value)} value={password}></input>
            </div>
            <p id='passworderror'>* Sorry, your password was incorrect for this email. Please double-check your password.</p>

            <button className='button' onClick={handleSignIn}>Sign in</button>
            <button className='accountbutton' onClick={forgetpassword}>Forget Password</button>
            <p id='resetpassword'>Reset Password link has been sent to your email. Please check your email.</p>
            <button className='accountbutton' onClick={()=> setRegestered(false)}>Create new Account</button>
            <button className='accountbutton' onClick={handleAnomonousLogin}>Continue as GUEST</button>

            </>):
            (<>
            <h1>Create Account</h1>
            <div className='input'>
                <MailOutlineIcon className='icons'></MailOutlineIcon>
                <input type='email' placeholder='Enter Your Email' onChange={(e) => setEmail(e.target.value)} value={email} id='email'></input>
            </div>
            <p id='emailerror'>* Sorry,the email you entered is incorrect. Please provide the correct email address.</p>
            <div className='input'>
                <LockOpenIcon className='icons'></LockOpenIcon>
                <input type='password' placeholder=' Password' onChange={(e) => setPassword(e.target.value)} value={password}></input>
            </div>
            <p id='passworderror'>* Your password must contain 6 characters</p>
            
            <div className='input'>
                <LockIcon className='icons'></LockIcon>
                <input type='password' placeholder="confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}></input>
            </div>    
            <p id='passworderror2'>* Sorry, you password is not same. Please double-check your password.</p>
            <button className='button' onClick={handleRegester}>Create Account</button>
            <button className='accountbutton' onClick={goBack}>Go Back</button>

            </>)}
        </div>
    )
}

export default Loginpage;
