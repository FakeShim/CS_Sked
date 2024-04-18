import './Style.css';
import Login from './components/Login'
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Home from './components/Home';
import Header from './components/Header';
import Faculty from './components/Faculty';
import Requests from './components/Requests';

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState("")
  console.log(loggedIn, " 2 ", email)

  useEffect(() => {
    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"))
    console.log('User from localStorage:', user);
    // If the token/email does not exist, mark the user as logged out
    if (!user || !user.token) {
        console.log('User is not logged in.');
      setLoggedIn(false)
      return
    }
    // else{
    //     set
    // }
 
    // If the token exists, verify it with the auth server to see if it is valid
    fetch("http://localhost:3080/verify", {
            method: "POST",
            headers: {
                'jwt-token': user.token
              }
        })
        .then(r => r.json())
        .then(r => {
            console.log('Login Response:', r);
            setLoggedIn('success' === r.message)
            console.log('response:','success' === r.message)
            console.log(loggedIn)
            setEmail(user.email)
            console.log(email, " : ", user.email)
        })
  }, [])

  useEffect(() => {
    console.log('Email updated:', email);
  }, [email]);


  return (
    
    <>
    
    
    <div className="App">
      <header className="App-header">
      <Router>
      <Header loggedIn={loggedIn}/>
            <Routes>
                <Route path="/" exact element={<Home email={email} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
                <Route path="/Login" element={<Login setLoggedIn={setLoggedIn} setEmail={setEmail} loggedIn={loggedIn} />} />
                <Route exact path="/Faculty" element={loggedIn ?<Faculty /> : <Navigate to="/Login"/>} />
                <Route exact path="/Requests" element={loggedIn ?<Requests /> : <Navigate to="/Login"/>} />
            </Routes>
        </Router>
      </header>
    </div>
    </>
  );

  }
export default App;