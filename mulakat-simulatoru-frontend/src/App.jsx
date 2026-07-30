import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // <-- YENİ EKLENDİ

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Interview from './pages/Interview';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

// Korumalı Rota Bileşeni
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isValidToken = token && token !== 'null' && token !== 'undefined' && token.trim() !== '';

  if (!isValidToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      {/* SAYFA DEĞİŞİKLİĞİNDE OTOMATİK EN ÜSTE VEYA İLGİLİ ALANA KAYDIRIR */}
      <ScrollToTop />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />

          {/* Korumalı Rotalar */}
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <Interview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}