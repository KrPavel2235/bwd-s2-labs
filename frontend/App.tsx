import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/pages/Home/Home';
import Login from './src/pages/Login/Login';
import Register from './src/pages/Register/Register';
import Events from './src/pages/Events/Events';
import NotFound from './src/pages/NotFound/NotFound';
import ProtectedRoute from './src/components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/events" element={<Events />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App; 