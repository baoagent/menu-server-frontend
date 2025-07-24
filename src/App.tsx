import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuList from './components/MenuList.tsx';
import './App.css';
import './i18n';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<MenuList />} />
        </Routes>
    </Router>
  );
}

export default App;