import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuList from './components/MenuList.tsx';
import './App.css';
import './i18n';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MenuList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;