import React from 'react';
import { useGameStore } from '../../state/store';
import { HOME_ACTIVITIES } from '../../data/furniture';
import { DATE_TYPE_LABELS } from '../../data/dates';

const HomeActivityPanel = () => {
  const placedFurniture = useGameStore(state => state.gameState.placedFurniture) || [];
  const gameState = useGameStore(state => state.gameState);
  
  // Calculate home style profile
  const profile = {};
  for (const furnitureId of placedFurniture) {
    const furniture = useGameStore.getState().gameState.furniture[furnitureId];
    if (furniture?.tags) {
      for (const tag of furniture.tags) {
        profile[tag] = (profile[tag] || 0) + 1;
      }
    }
  }
  
  // Get available home activities based on placed furniture tags
  const availableActivities = Object.entries(HOME_ACTIVITIES || {})
    .filter(([id, activity]) => {
      // Activity is available if at least one of its tags matches placed furniture
      return activity.tags.some(tag => profile[tag] > 0);
    });
  
  // Get all home activities (for display)
  const allActivities = Object.entries(HOME_ACTIVITIES || {});
  
  return (
    <div className="bento-card home-activities">
      <h2 className="section-title">Home Activities</h2>
      
      {placedFurniture.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Add furniture to unlock home activities.
        </p>
      ) : (
        <>
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Available Activities
            </h4>
            {availableActivities.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {availableActivities.map(([id, activity]) => (
                  <span key={id} className="perk-badge" style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34d399' }}>
                    {DATE_TYPE_LABELS[activity.dateType] || activity.dateType.replace('_', ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                No activities available with current furniture
              </p>
            )}
          </div>
          
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              All Home Activities
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
              {allActivities.map(([id, activity]) => {
                const isAvailable = availableActivities.some(([aid]) => aid === id);
                const dateLabel = DATE_TYPE_LABELS[activity.dateType] || activity.dateType.replace('_', ' ');
                
                return (
                  <div key={id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    fontSize: '0.8rem',
                    opacity: isAvailable ? 1 : 0.5
                  }}>
                    <span style={{ 
                      width: '8px', 
                      height: '8px', 
                      background: isAvailable ? '#34d399' : 'rgba(255,255,255,0.2)', 
                      borderRadius: '50%'
                    }}></span>
                    <span style={{ color: isAvailable ? 'white' : 'var(--text-secondary)' }}>
                      {dateLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(HomeActivityPanel);
