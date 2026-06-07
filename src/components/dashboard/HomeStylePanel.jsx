import React from 'react';
import { useGameStore } from '../../state/store';
import { calculateHomeStyleProfile, getDominantHomeStyles, HOME_STYLE_TAGS } from '../../data/furniture';

const HomeStylePanel = () => {
  const placedFurniture = useGameStore(state => state.gameState.placedFurniture) || [];
  
  const profile = calculateHomeStyleProfile(placedFurniture);
  const dominantStyles = getDominantHomeStyles(placedFurniture);
  
  // Calculate total furniture count
  const totalFurniture = placedFurniture.length;
  
  return (
    <div className="bento-card home-style">
      <h2 className="section-title">Home Identity</h2>
      
      {totalFurniture === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Your home has no furniture yet. Add furniture to develop your home's style.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Dominant Styles
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {dominantStyles.length > 0 ? (
                dominantStyles.map((tag, index) => (
                  <span 
                    key={tag}
                    className="perk-badge"
                    style={{
                      background: `var(--style-${tag}-bg, rgba(59, 130, 246, 0.2))`,
                      color: `var(--style-${tag}-fg, white)`,
                      border: `1px solid var(--style-${tag}-border, rgba(59, 130, 246, 0.5))`
                    }}
                  >
                    {tag} ({profile[tag]})
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  No dominant styles yet
                </span>
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Style Profile
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.5rem' }}>
              {HOME_STYLE_TAGS.map((tag) => {
                const count = profile[tag] || 0;
                const percentage = totalFurniture > 0 ? Math.round((count / totalFurniture) * 100) : 0;
                
                return (
                  <div key={tag} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ width: '8px', height: '8px', background: count > 0 ? '#3b82f6' : 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></span>
                    <span style={{ color: count > 0 ? 'white' : 'var(--text-secondary)' }}>{tag}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>({count})</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem' }}>
            {totalFurniture} pieces of furniture placed
          </p>
        </>
      )}
    </div>
  );
};

export default React.memo(HomeStylePanel);
