import logo from './logo.svg';
import './App.css';

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SlowSearch from "./components/SlowSearch";
import BigDataAnalysis from "./components/BigDataAnalysis";

const App = () => {
  return (
      <Router>
        <div style={{ padding: "20px" }}>
          <h1>React Frontend</h1>
          <nav>
            <Link to="/">Home</Link> | <Link to="/search">Country Search</Link>| <Link to="/big-data">Big Data Analysis</Link>
          </nav>
          <Routes>
            <Route path="/" element={<h2>Welcome to the React App</h2>} />
            <Route path="/search" element={<SlowSearch />} />
            <Route path="/big-data" element={<BigDataAnalysis />} />
          </Routes>
        </div>
      </Router>
  );
};

export default App;

