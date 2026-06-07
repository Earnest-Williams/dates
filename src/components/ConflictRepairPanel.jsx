import { useGameStore } from '../state/store';
import { memo } from "react";
import { memo } from "react";
import { NPCS } from '../data/npcs';
import { getAvailableRepairActions } from '../sim/relationshipRepair';

const ConflictRepairPanel = ({ npcId, onClose }) => {
  const { gameState, attemptRepair } = useGameStore();
  
  const npc = NPCS.find(n => n.id === npcId);
  const match = gameState.matches[npcId];

  if (!npc || !match || (!match.activeConflictId && !match.pendingRepairScene)) return null;

  const repairOptions = getAvailableRepairActions(gameState, npcId, match);

  const handleRepair = (actionId) => {
    attemptRepair(npcId, actionId);
    onClose();
  };

  const conflictLabel = match.activeConflictId || match.pendingRepairScene;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', color: 'white', maxWidth: '500px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ color: '#f87171', marginBottom: '0.5rem' }}>Repair Needed with {npc.name}</h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Repair depends on timing, memory, compatibility, and choosing an approach that fits what happened.</p>
      </header>

      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: '#fca5a5' }}>Conflict: {conflictLabel}</h4>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>This rift will stay active until a repair attempt lands in context.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
        <h4 style={{ margin: 0 }}>Repair Options</h4>
        {repairOptions.map((option) => (
          <button key={option.id} className="btn-primary" onClick={() => handleRepair(option.id)} style={{ textAlign: 'left', padding: '1rem', background: option.id === 'context_repair' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(255,255,255,0.05)', border: option.id === 'context_repair' ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: option.id === 'context_repair' ? '#6ee7b7' : 'white' }}>{option.label}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{option.description}</div>
            <div style={{ fontSize: '0.75rem', color: option.evaluation.success ? '#6ee7b7' : '#fca5a5', marginTop: '0.35rem' }}>
              Readiness {option.evaluation.score}/100 · {option.evaluation.reason}
            </div>
          </button>
        ))}
      </div>

      <button className="btn-secondary" onClick={onClose} style={{ marginTop: '1rem', padding: '0.75rem' }}>
        Cancel
      </button>
    </div>
  );
};

export default memo(ConflictRepairPanel);
