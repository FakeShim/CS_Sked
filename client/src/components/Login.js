// src/components/Login.js

import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com'

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [passwordErr, setPasswordErr] = useState('');

  const navigate = useNavigate()
  if (props.loggedIn) {
    console.log('Already Logged In')
    navigate('/')
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    setEmailErr('')
    setPasswordErr('')

    //else {
    //   alert('Invalid username or password');
    // }
    if ('' === email) {
      setEmailErr('Please enter your email')
      return
    }

    if ('' === password) {
      console.log('No password')
      setPasswordErr('Please enter a password')
      return
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setEmailErr('Please enter a valid email address');
      return;
    }
    if (password.length < 7) {
      setPasswordErr('The password must be 8 characters or longer')
      return
    } 
    try {
      const response = await fetch(`${backend_host}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: no-cors,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify({ email, token: data.token }));
        props.setLoggedIn(true);
        props.setEmail(email);
        navigate('/');
      } else {
        setEmailErr('Wrong Email or Password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setEmailErr('Error logging in. Please try again later.');
    }
  };


// Log in a user using email and password
const logIn = () => {
  fetch(`${backend_host}/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: no-cors,
    body: JSON.stringify({ email, password }),
  })
    .then((r) => r.json())
    .then((r) => {
      console.log('Login Response:', r); 
      if ('success' === r.message) {
        localStorage.setItem('user', JSON.stringify({ email, token: r.token }))
        props.setLoggedIn(true)
        //console.log("Login status:" , props.loggedIn)
        props.setEmail(email)
        navigate('/')
      } else {
        //window.alert('Wrong email or password')
        setEmailErr('Wrong Email or Password')
      }
    })
}

  const handleLogout = () => {
    props.setLoggedIn(false);
    localStorage.removeItem("user")
  };

  return (
    <div>
      {props.loggedIn ? (
        <div>
          <h2>You Shouldn't Be Here!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email  :</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="errorLabel">{emailErr}</label>
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="errorLabel">{passwordErr}</label>
          </div>
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;