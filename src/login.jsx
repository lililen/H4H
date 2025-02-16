import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login(){
    const navigate = useNavigate();
    const handleSignIn =()=> {
        ///placehold for auth
        navigate('/dashboard');
    }
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <input
                  type="text"
                  placeholder='Username/Email'
                  className="login-input"
                  />
                  <input
                    type="password"
                    placeholder='Password'
                    className='login-input'
                  />
                  <button onClick={handleSignIn} className="login-button">
                    Sign In
                    </button>
            </div>
        </div>
    );
}

export default Login;
