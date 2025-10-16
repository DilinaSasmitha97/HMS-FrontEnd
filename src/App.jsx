import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Patients from './pages/Patients';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/patients" element={<Patients />} />
      </Routes>
    </Router>
  );
}

export default App;
