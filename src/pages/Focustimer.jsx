import { useState, useEffect, useRef } from 'react';
import './FocusTimer.css';

const  FocusTimer  =  () => {
  const [mode, setMode] = useState('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(120);
  const timerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('focusSessions');
    const savedTime = localStorage.getItem('totalFocusTime');
    const savedDate = localStorage.getItem('focusDate');
    const today = new Date().toDateString();
    if (savedDate === today) {
      if (saved) setSessionsCompleted(parseInt(saved));
      if (savedTime) setTotalFocusTime(parseInt(savedTime));
    } else {
      localStorage.setItem('focusDate', today);
      localStorage.setItem('focusSessions', '0');
      localStorage.setItem('totalFocusTime', '0');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('focusSessions', sessionsCompleted.toString());
    localStorage.setItem('totalFocusTime', totalFocusTime.toString());
  }, [sessionsCompleted, totalFocusTime]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const handleTimerComplete = () => {
    if (mode === 'focus') {
      setTotalFocusTime(prev => prev + focusDuration * 60);
      setSessionsCompleted(prev => prev + 1);
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      setMode('focus');
      setTimeLeft(focusDuration * 60);
    }
    setIsActive(true);
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };
  const skipToNext = () => {
    if (mode === 'focus') {
      setTotalFocusTime(prev => prev + (focusDuration * 60 - timeLeft));
      setSessionsCompleted(prev => prev + 1);
      setMode('break');
      setTimeLeft(breakDuration * 60);
    } else {
      setMode('focus');
      setTimeLeft(focusDuration * 60);
    }
    setIsActive(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="focus-page">
      <h1>🎯 Focus Timer</h1>
      <div className="focus-layout">
        <div className="timer-card">
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${mode === 'focus' ? 'active' : ''}`} 
              onClick={() => { 
                if (!isActive) { 
                  setMode('focus'); 
                  setTimeLeft(focusDuration * 60); 
                } 
              }}
            >
              📚 Focus
            </button>
            <button 
              className={`mode-btn ${mode === 'break' ? 'active' : ''}`} 
              onClick={() => { 
                if (!isActive) { 
                  setMode('break'); 
                  setTimeLeft(breakDuration * 60); 
                } 
              }}
            >
              ☕ Break
            </button>
          </div>

          {/* Timer Circle - Simplified Structure */}
          <div className="timer-circle">
            <svg width="260" height="260" viewBox="0 0 260 260">
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="130"
                cy="130"
                r={radius}
                fill="none"
                stroke={mode === 'focus' ? '#1e3a8a' : '#10b981'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
            <div className="timer-content">
              <div className="timer-time">{formatTime(timeLeft)}</div>
              <div className="timer-label">{mode === 'focus' ? 'Study Time' : 'Break Time'}</div>
            </div>
          </div>

          <div className="timer-controls">
            {!isActive ? (
              <button onClick={startTimer} className="control-btn start">▶ Start</button>
            ) : (
              <button onClick={pauseTimer} className="control-btn pause">⏸ Pause</button>
            )}
            <button onClick={resetTimer} className="control-btn reset">🔄 Reset</button>
            <button onClick={skipToNext} className="control-btn skip">⏩ Skip</button>
          </div>

          <div className="timer-settings">
            <div className="setting-item">
              <label>Focus (min)</label>
              <input 
                type="number" 
                min="1" 
                max="60" 
                value={focusDuration} 
                onChange={(e) => { 
                  const val = parseInt(e.target.value) || 25; 
                  setFocusDuration(val); 
                  if (mode === 'focus' && !isActive) setTimeLeft(val * 60); 
                }} 
                disabled={isActive} 
              />
            </div>
            <div className="setting-item">
              <label>Break (min)</label>
              <input 
                type="number" 
                min="1" 
                max="30" 
                value={breakDuration} 
                onChange={(e) => { 
                  const val = parseInt(e.target.value) || 5; 
                  setBreakDuration(val); 
                  if (mode === 'break' && !isActive) setTimeLeft(val * 60); 
                }} 
                disabled={isActive} 
              />
            </div>
          </div>
        </div>

        <div className="stats-card">
          <h2>📊 Today's Progress</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">⏱️ Focus Time</span>
              <span className="stat-value">{Math.floor(totalFocusTime / 60)} min</span>
              <span className="stat-sub">{((totalFocusTime / 60) / dailyGoal * 100).toFixed(0)}% of goal</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">✅ Sessions</span>
              <span className="stat-value">{sessionsCompleted}</span>
              <span className="stat-sub">completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">🎯 Daily Goal</span>
              <span className="stat-value">{dailyGoal} min</span>
              <input 
                type="number" 
                min="1" 
                value={dailyGoal} 
                onChange={(e) => setDailyGoal(parseInt(e.target.value) || 120)} 
                className="goal-input" 
              />
            </div>
            <div className="stat-item">
              <span className="stat-label">🔥 Streak</span>
              <span className="stat-value">7</span>
              <span className="stat-sub">days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FocusTimer;