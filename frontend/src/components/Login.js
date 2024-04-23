// src/components/Login.js

import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const backend_host = 'https://cs495-scheduler-3d74a13dd60d.herokuapp.com/'

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
  const handleLogin = (e) => {
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

    if (password.length < 7) {
      setPasswordErr('The password must be 8 characters or longer')
      return
    }
 // Check if email has an account associated with it
 checkAccountExists((accountExists) => {
  // If yes, log in
  if (accountExists) logIn()
  // Else, ask user if they want to create a new account and if yes, then log in
  else if (
   // window.confirm(
      // 'An account does not exist with this email address: ' + email + '. Do you want to create a new account?',
      //'Not a Valid Account'
   // )
   setEmailErr('Not a Valid Account')
  ) {
    //logIn()
  }
})


  };
  // Call the server API to check if the given email ID already exists
const checkAccountExists = (callback) => {
  fetch(`http://${backend_host}:3080/check-account`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })
    .then((r) => r.json())
    .then((r) => {
      callback(r?.userExists)
    })
}

// Log in a user using email and password
const logIn = () => {
  fetch(`http://${backend_host}:3080/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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