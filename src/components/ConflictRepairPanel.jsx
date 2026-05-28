import React from 'react';
import { useGameStore } from '../state/store';
import { NPCS } from '../data/npcs';

const ConflictRepairPanel = ({ npcId, onClose }) => {
  const { gameState, attemptRepair } = useGameStore();
  
  const npc = NPCS.find(n => n.id === npcId);
  const match = gameState.matches[npcId];

  if (!npc || !match || !match.activeConflictId) return null;

  const handleRepair = (actionId) => {
    attemptRepair(npcId, actionId);
    onClose();
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', color: 'white', maxWidth: '500px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Active Conflict with {npc.name}</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>You need to repair this relationship before you can continue progressing.</p>
      </header>

      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#fca5a5' }}>Conflict: {match.activeConflictId}</h4>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>This conflict has caused a rift in your relationship.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <h4 style={{ margin: 0 }}>Repair Options</h4>
        
        <button className="btn-primary" onClick={() => handleRepair('apologize')} style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Apologize Directly</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Takes 1 hour. Chance of success depends on compatibility and history.</div>
        </button>

        <button className="btn-primary" onClick={() => handleRepair('give_space')} style={{ textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Give Them Space</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Takes no time. Sometimes they just need time to cool off.</div>
        </button>

        {match.pendingRepairScene && (
          <button className="btn-primary" onClick={() => handleRepair('context_repair')} style={{ textAlign: 'left', padding: '1rem', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid #34d399' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#6ee7b7' }}>Follow up: {match.pendingRepairScene}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Specific repair opportunity based on your previous choices. High success chance.</div>
          </button>
        )}
      </div>

      <button className="btn-secondary" onClick={onClose} style={{ marginTop: '1rem', padding: '0.75rem' }}>
        Cancel
      </button>
    </div>
  );
};

export default ConflictRepairPanel;
