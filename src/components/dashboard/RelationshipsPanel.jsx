import React, { useState } from 'react';
import { useGameStore } from '../../state/store';
import { NPCS } from '../../data/npcs';
import ConflictRepairPanel from '../ConflictRepairPanel';

const getCompatibilitySignal = (score) => {
  if (score === null || score === undefined) return "Unknown Fit";
  if (score > 70) return "Strong long-term fit";
  if (score > 40) return "Mixed long-term fit";
  return "Fragile long-term fit";
};

const RelationshipsPanel = () => {
  const matches = useGameStore(state => state.gameState.matches) || {};
  const [repairNpcId, setRepairNpcId] = useState(null);
  
  const metNpcs = Object.entries(matches).filter(([_, data]) => data.met);

  return (
    <div className="bento-card social" style={{ gridColumn: 'span 2' }}>
      <h2 className="section-title">Relationships</h2>
      
      {metNpcs.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No active relationships yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {metNpcs.map(([npcId, match]) => {
            const npcDef = NPCS.find(n => n.id === npcId);
            const name = npcDef ? npcDef.name : npcId;
            
            return (
              <div key={npcId} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', borderLeft: match.activeConflictId ? '4px solid #f87171' : '4px solid #34d399' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{getCompatibilitySignal(match.compatibilityScore)}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                  <div><strong>Relationship:</strong> {match.relationship}</div>
                  <div><strong>Chemistry:</strong> {match.chemistry}</div>
                </div>

                {match.activeConflictId && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ color: '#fca5a5', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      ⚠️ Active Conflict! Needs Repair.
                    </div>
                    <button className="btn-secondary" onClick={() => setRepairNpcId(npcId)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                      Attempt Repair
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {repairNpcId && (
        <div className="app-overlay-container animate-fade-in" style={{ zIndex: 1000 }}>
          <ConflictRepairPanel npcId={repairNpcId} onClose={() => setRepairNpcId(null)} />
        </div>
      )}
    </div>
  );
};

export default React.memo(RelationshipsPanel);
