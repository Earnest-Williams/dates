import React from 'react';

const NeedRing = ({ label, value, displayValue, displayInverse, color }) => {
  const finalDisplay = displayInverse ? displayValue : Math.round(value);
  const normalizedRadius = 36;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = displayInverse ? (100 - value) : value; // For hunger, starvation means ring is empty if hunger is high
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  
  return (
    <div className={`circular-ring ${(percent < 20) ? 'ring-danger' : ''}`} style={{ color }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg className="ring-svg">
          <circle className="ring-bg" cx="40" cy="40" r={normalizedRadius} />
          <circle 
            className="ring-fill" 
            cx="40" 
            cy="40" 
            r={normalizedRadius} 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            stroke={color} 
          />
        </svg>
        <div className="ring-value" style={{ color: '#fff' }}>
          {finalDisplay}
        </div>
      </div>
      <span className="ring-label">{label}</span>
    </div>
  );
};

export default React.memo(NeedRing);
