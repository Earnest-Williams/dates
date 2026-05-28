import React from 'react';
import { useGameStore } from '../../state/store';
import { NPCS } from '../../data/npcs';

const PromisesPanel = () => {
  const matches = useGameStore(state => state.gameState.matches) || {};
  
  // Flatten promises from all matches.
  // Assuming matches have a `promises` array: [{ text: '...', deadline: ... }] or similar.
  // Wait, if promises aren't strictly implemented yet in state, we'll just check for it.
  const allPromises = [];
  
  Object.entries(matches).forEach(([npcId, match]) => {
    if (match.promises && Array.isArray(match.promises)) {
      match.promises.forEach(p => {
        allPromises.push({ npcId, ...p });
      });
    }
  });

  return (
    <div className="bento-card social">
      <h2 className="section-title">Promises</h2>
      
      {allPromises.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No active promises.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {allPromises.map((p, i) => {
            const npcDef = NPCS.find(n => n.id === p.npcId);
            const name = npcDef ? npcDef.name : p.npcId;
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>To {name}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.text || "Pending Promise"}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default React.memo(PromisesPanel);
