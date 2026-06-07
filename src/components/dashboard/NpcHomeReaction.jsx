import React from 'react';
import { useGameStore } from '../../state/store';
import { getNpcHomeStyleReaction, NPC_HOME_STYLE_REACTIONS } from '../../data/furniture';
import { NPCS } from '../../data/npcs';

const NpcHomeReaction = ({ npcId }) => {
  const placedFurniture = useGameStore(state => state.gameState.placedFurniture) || [];
  const matches = useGameStore(state => state.gameState.matches) || {};
  
  const npc = NPCS.find(n => n.id === npcId);
  const match = matches[npcId];
  
  if (!npc || !match) return null;
  
  const reaction = getNpcHomeStyleReaction(npcId, placedFurniture);
  const preferredStyles = NPC_HOME_STYLE_REACTIONS[npcId] || [];
  
  return (
    <div className="bento-card npc-home-reaction">
      <h2 className="section-title">Home Compatibility with {npc.name}</h2>
      
      {placedFurniture.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Add furniture to see how {npc.name} reacts to your home.
        </p>
      ) : (
        <>
          {reaction ? (
            <>
              <div style={{ 
                background: reaction.fit === 'comfortable' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)',
                border: reaction.fit === 'comfortable' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: reaction.fit === 'comfortable' ? '#34d399' : 'var(--text-secondary)' }}>
                  {reaction.fit === 'comfortable' ? '✓ Comfortable Fit' : 'Neutral'}
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{reaction.text}</p>
              </div>
              
              {reaction.tags && reaction.tags.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Matching Styles
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {reaction.tags.map((tag, index) => (
                      <span key={index} className="perk-badge" style={{ background: 'rgba(52, 211, 153, 0.2)', border: '1px solid #34d399' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ 
              background: 'rgba(255,255,255,0.05)',
              padding: '1rem', 
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Neutral</h4>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Your home doesn't particularly stand out to {npc.name} yet.</p>
            </div>
          )}
          
          <div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {npc.name}'s Preferred Styles
            </h4>
            {preferredStyles.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {preferredStyles.map((tag, index) => (
                  <span key={index} className="perk-badge" style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.5)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                No specific preferences
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(NpcHomeReaction);
