import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../../state/store';
import { formatTime, getDaypart } from '../../sim/time';
import './TimeControls.css';

const SPEED_INTERVALS = {
  1: 3000,
  2: 1500,
  4: 750,
  8: 375,
};

const TimeControls = ({ gameState }) => {
  const { time } = gameState;
  const { day, hour, minute } = time;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x, 8x
  const [autoTickInterval, setAutoTickInterval] = useState(null);
  
  const advanceTime = useGameStore(state => state.advanceTime);
  const applyNeedsDecay = useGameStore(state => state.applyNeedsDecay);
  
  const daypart = getDaypart(hour);
  const timeString = formatTime(hour, minute);
  
  // Start auto-ticking
  const startAutoTick = useCallback(() => {
    if (autoTickInterval) {
      clearInterval(autoTickInterval);
    }
    
    const interval = setInterval(() => {
      advanceTime(1);
      applyNeedsDecay(1);
    }, SPEED_INTERVALS[speed]);
    
    setAutoTickInterval(interval);
    setIsPlaying(true);
  }, [advanceTime, applyNeedsDecay, speed, autoTickInterval]);

  // Stop auto-ticking
  const stopAutoTick = useCallback(() => {
    if (autoTickInterval) {
      clearInterval(autoTickInterval);
      setAutoTickInterval(null);
    }
    setIsPlaying(false);
  }, [autoTickInterval]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      stopAutoTick();
    } else {
      startAutoTick();
    }
  }, [isPlaying, startAutoTick, stopAutoTick]);

  // Change speed
  const handleSpeedChange = useCallback((newSpeed) => {
    setSpeed(newSpeed);
    if (isPlaying) {
      stopAutoTick();
      startAutoTick();
    }
  }, [isPlaying, startAutoTick, stopAutoTick]);

  // Manual tick buttons
  const handleSingleTick = useCallback(() => {
    advanceTime(1);
    applyNeedsDecay(1);
  }, [advanceTime, applyNeedsDecay]);

  const handleTenTicks = useCallback(() => {
    advanceTime(10);
    applyNeedsDecay(10);
  }, [advanceTime, applyNeedsDecay]);

  const handleHourTick = useCallback(() => {
    advanceTime(6);
    applyNeedsDecay(6);
  }, [advanceTime, applyNeedsDecay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoTickInterval) {
        clearInterval(autoTickInterval);
      }
    };
  }, [autoTickInterval]);

  // Get time progression status
  const getTimeStatus = () => {
    if (isPlaying) {
      return `Playing at ${speed}x speed`;
    }
    return 'Paused';
  };

  const speedLabels = {
    1: '1x',
    2: '2x',
    4: '4x',
    8: '8x',
  };

  return (
    <div className="bento-card time-controls">
      <h2 className="section-title">Time Controls</h2>
      
      <div className="time-display">
        <div className="time-info">
          <span className="time-day">Day {day}</span>
          <span className="time-separator">•</span>
          <span className="time-time">{timeString}</span>
          <span className="time-separator">•</span>
          <span className="time-daypart">{daypart}</span>
        </div>
        <div className="time-status">
          {getTimeStatus()}
        </div>
      </div>

      {/* Play/Pause Controls */}
      <div className="playback-controls">
        <button 
          className={`control-btn ${isPlaying ? 'active' : ''}`}
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause time progression' : 'Play time progression'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="speed-controls">
          {[1, 2, 4, 8].map(s => (
            <button 
              key={s}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => handleSpeedChange(s)}
              disabled={!isPlaying}
              title={`Set speed to ${s}x`}
            >
              {speedLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Manual Tick Controls */}
      <div className="manual-controls">
        <button 
          className="tick-btn"
          onClick={handleSingleTick}
          title="Advance 10 minutes"
        >
          +10m
        </button>
        <button 
          className="tick-btn"
          onClick={handleHourTick}
          title="Advance 1 hour"
        >
          +1h
        </button>
        <button 
          className="tick-btn"
          onClick={handleTenTicks}
          title="Advance 1 hour 40 minutes"
        >
          +1h40m
        </button>
      </div>

      {/* Time progression info */}
      <div className="time-info-panel">
        <p className="info-text">
          <strong>Note:</strong> Time progresses in 10-minute increments. 
          Each tick advances time by 10 minutes and decays your needs.
        </p>
        <p className="info-text">
          <strong>Tip:</strong> Use auto-play for hands-off progression, 
          or manual ticks for precise control.
        </p>
      </div>
    </div>
  );
};

export default memo(TimeControls);
