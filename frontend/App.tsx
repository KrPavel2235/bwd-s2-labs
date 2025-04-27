import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './src/store/hooks';
import { restoreSession } from './src/store/slices/authSlice';
import Home from './src/pages/Home/Home';
import Login from './src/pages/Login/Login';
import Register from './src/pages/Register/Register';
import Events from './src/pages/Events/Events';
import Profile from './src/pages/Profile/Profile';
import NotFound from './src/pages/NotFound/NotFound';
import ProtectedRoute from './src/components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
