import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const InterviewTimer = ({ durationInSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);

  useEffect(() => {
    setTimeLeft(durationInSeconds);
  }, [durationInSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onTimeUp) onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isUrgent = timeLeft <= 15;

  return (
    <div className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl font-mono text-xs font-bold transition-all duration-300 shadow-lg border ${
      isUrgent 
        ? 'bg-rose-950/40 border-rose-500/50 text-rose-400 animate-pulse shadow-rose-500/10' 
        : 'bg-[#131b2e] border-[#222f4c] text-slate-200 shadow-black/20'
    }`}>
      <div className={`p-1.5 rounded-xl ${isUrgent ? 'bg-rose-500/20 text-rose-400' : 'bg-[#1e293b] text-[#f97316]'}`}>
        <Clock size={15} className={isUrgent ? 'animate-spin' : ''} />
      </div>
      <div className="flex flex-col">
        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">Kalan Süre</span>
        <span className={`text-sm font-black ${isUrgent ? 'text-rose-400' : 'text-white'}`}>
          {formatTime(timeLeft)}
        </span>
      </div>
    </div>
  );
};

export default InterviewTimer;