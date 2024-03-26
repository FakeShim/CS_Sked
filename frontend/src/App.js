import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Home from './Home';
import Faculty from './Faculty';
import Requests from './Requests';

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} /> {}
          <Route exact path="/Faculty" element={<Faculty />} />
          <Route exact path="/Requests" element={<Requests />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
