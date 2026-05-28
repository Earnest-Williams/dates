import React from 'react';

const StatBar = ({ label, value, color }) => (
  <div className="stat-item">
    <div className="stat-header">
      <span>{label}</span>
      <span>{value}/100</span>
    </div>
    <div className="stat-bar-bg">
      <div className="stat-bar-fill" style={{ width: `${value}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

export default React.memo(StatBar);
