import React from 'react';

const OpportunitiesPanel = ({ onOpenMap }) => {
  return (
    <div className="bento-card social">
      <h2 className="section-title">Opportunities</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Explore the city to discover organic encounters and location events.
        </p>
        
        <button className="btn-secondary" onClick={onOpenMap} style={{ padding: '0.5rem', marginTop: '0.5rem' }}>
          Open Map
        </button>
      </div>
    </div>
  );
};

export default React.memo(OpportunitiesPanel);
