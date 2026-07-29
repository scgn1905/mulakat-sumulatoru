import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Interview from './pages/Interview';

// Korumalı Rota Bileşeni
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isValidToken = token && token !== 'null' && token !== 'undefined' && token.trim() !== '';

  if (!isValidToken) {
    // Giriş yapılmamışsa mülakat sayfasına sokma, Login'e at
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Sadece Geçerli Token'ı Olan Kullanıcılar Girebilir */}
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}