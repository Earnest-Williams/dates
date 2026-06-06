import React from 'react';
import { useGameStore } from '../../state/store';
import { REPUTATION_CIRCLES } from '../../sim/reputation';

const ReputationPanel = () => {
  const reputation = useGameStore(state => state.gameState.reputation) || {};
  const matches = useGameStore(state => state.gameState.matches) || {};
  
  // Get NPCs for each circle
  const getNpcsInCircle = (circleName) => {
    const npcs = REPUTATION_CIRCLES[circleName] || [];
    return npcs.filter(npcId => matches[npcId]?.met);
  };

  // Calculate reputation level description
  const getReputationLevel = (value) => {
    if (value >= 50) return { level: 'Excellent', color: '#10b981', icon: '🌟' };
    if (value >= 20) return { level: 'Good', color: '#34d399', icon: '👍' };
    if (value >= 0) return { level: 'Neutral', color: '#fbbf24', icon: '😐' };
    if (value >= -20) return { level: 'Poor', color: '#f87171', icon: '👎' };
    return { level: 'Terrible', color: '#ef4444', icon: '💀' };
  };

  // Calculate average reputation
  const repValues = Object.values(reputation);
  const averageRep = repValues.length > 0 ? Math.round(repValues.reduce((sum, val) => sum + val, 0) / repValues.length) : 0;
  const averageLevel = getReputationLevel(averageRep);

  return (
    <div className="bento-card reputation">
      <h2 className="section-title">Reputation Circles</h2>
      
      {/* Overall Reputation Summary */}
      <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.2rem' }}>{averageLevel.icon}</span>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Overall Social Standing</div>
            <div style={{ fontWeight: 'bold', color: averageLevel.color }}>
              {averageLevel.level} ({averageRep})
            </div>
          </div>
        </div>
      </div>

      {/* Individual Reputation Circles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {Object.entries(REPUTATION_CIRCLES).map(([circleName, npcs]) => {
          const value = reputation[circleName] || 0;
          const level = getReputationLevel(value);
          const metNpcs = getNpcsInCircle(circleName);
          
          return (
            <div 
              key={circleName}
              style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '0.75rem',
                borderRadius: '8px',
                border: `2px solid ${level.color}`,
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}
              title={`${circleName.charAt(0).toUpperCase() + circleName.slice(1)}: ${value}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{level.icon}</span>
                <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {circleName.charAt(0).toUpperCase() + circleName.slice(1)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: level.color }}>
                  {level.level}
                </span>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {value > 0 ? `+${value}` : value}
                </span>
              </div>
              
              {metNpcs.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  {metNpcs.length} contact{metNpcs.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reputation Tips */}
      <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
        <p>💡 <em>Tip: Reputation affects gossip risk, relationship repairs, and organic encounters.</em></p>
      </div>
    </div>
  );
};

export default React.memo(ReputationPanel);