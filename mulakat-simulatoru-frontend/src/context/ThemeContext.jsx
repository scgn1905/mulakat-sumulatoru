import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'dark');
  const [colorTheme, setColorTheme] = useState(() => localStorage.getItem('colorTheme') || 'blue');

  // RENK DEĞERLERİ KÜTÜPHANESİ
  const themeColors = {
    blue: {
      primary: '#2563eb',      // Ana renk
      hover: '#1d4ed8',        // Hover rengi
      lightBg: 'rgba(37, 99, 235, 0.12)', // Açık arka plan/glow
      textLight: '#1d4ed8'
    },
    emerald: {
      primary: '#10b981',
      hover: '#047857',
      lightBg: 'rgba(16, 185, 129, 0.12)',
      textLight: '#047857'
    },
    orange: {
      primary: '#f97316',
      hover: '#ea580c',
      lightBg: 'rgba(249, 115, 22, 0.12)',
      textLight: '#c2410c'
    }
  };

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('colorTheme', colorTheme);

    const root = document.documentElement;
    
    // Koyu / Açık Mod Sınıfları
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Renk Teması Ataması
    root.setAttribute('data-theme', colorTheme);
    const selected = themeColors[colorTheme] || themeColors.blue;

    // CSS Değişkenlerini Kök (Root) Seviyesine Yazma
    root.style.setProperty('--primary-color', selected.primary);
    root.style.setProperty('--primary-hover', selected.hover);
    root.style.setProperty('--primary-bg', selected.lightBg);
    root.style.setProperty('--primary-text-light', selected.textLight);

  }, [mode, colorTheme]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, colorTheme, setColorTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return { mode: 'dark', setMode: () => {}, colorTheme: 'blue', setColorTheme: () => {} };
  }
  return context;
};

export default ThemeProvider;