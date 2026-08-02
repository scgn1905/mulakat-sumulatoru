import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop'; // <-- YENİ EKLENDİ
import AIBotAssistant from './components/AIBotAssistant'; // <-- AI ASİSTAN MASKOTU EKLENDİ

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Interview from './pages/Interview';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Leaderboard from './pages/Leaderboard'; // <-- LİDERLİK TABLOSU SAYFASI EKLENDİ
import Payment from './pages/Payment'; // <-- YENİ EKLENDİ: ÖDEME SAYfASI
import ForgotPassword from './pages/ForgotPassword'; // <-- YENİ EKLENDİ: ŞİFREMİ UNUTTUM SAYFASI
import ResetPassword from './pages/ResetPassword';   // <-- YENİ EKLENDİ: YENİ ŞİFRE BELİRLEME SAYFASI

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative">
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
          
          {/* Şifre Sıfırlama Rotaları */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Global Liderlik Tablosu Rotası */}
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Ödeme Sayfası Rotası (Giriş yapılmışsa erişilebilir ya da doğrudan serbest bırakılabilir) */}
          <Route 
            path="/payment" 
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            } 
          />

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

      {/* SİTENİN HER YERİNDE GEZEN ANİMASYONLU YARDIM MASKOTU */}
      <AIBotAssistant />
    </div>
  );
}