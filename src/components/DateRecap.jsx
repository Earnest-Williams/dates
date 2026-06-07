import { useGameStore } from '../state/store';
import { memo } from "react";
import { memo } from "react";

const DateRecap = () => {
  const { gameState, closeDateRecap } = useGameStore();
  const recap = gameState.lastDateRecap;

  if (!recap) return null;

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', color: 'white', maxWidth: '640px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>Date Concluded</h2>
        <p style={{ fontSize: '1.1rem' }}>{recap.logText}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Relationship</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: recap.relationshipChange >= 0 ? '#4ade80' : '#f87171' }}>
            {recap.relationshipChange >= 0 ? '+' : ''}{recap.relationshipChange}
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Chemistry</h4>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: recap.chemistryChange >= 0 ? '#3b82f6' : '#f87171' }}>
            {recap.chemistryChange >= 0 ? '+' : ''}{recap.chemistryChange}
          </div>
        </div>
      </div>

      {recap.compatibilityBand && (
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.25rem 0', color: '#60a5fa' }}>Compatibility Insight</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>You sensed a <strong>{recap.compatibilityBand}</strong> long-term fit with {recap.npcName}.</p>
        </div>
      )}

      {recap.memoriesGained?.length > 0 && (
        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Memories Formed</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
            {recap.memoriesGained.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {recap.promisesCreated?.length > 0 && (
        <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#fbbf24' }}>Promises Made</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#fcd34d' }}>
            {recap.promisesCreated.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      {recap.conflictRisk && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#f87171' }}>⚠️ Conflict Sparked</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#fca5a5' }}>This interaction caused tension ({recap.conflictRisk}). You will need to repair this later.</p>
        </div>
      )}
      
      {recap.repairOpportunity && (
        <div style={{ background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#34d399' }}>Repair Opportunity Opened</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6ee7b7' }}>You can now try to repair: {recap.repairOpportunity}</p>
        </div>
      )}

      <button className="btn-primary" onClick={closeDateRecap} style={{ padding: '15px', marginTop: '10px', fontSize: '1.1rem', fontWeight: 'bold' }}>
        Continue
      </button>
    </div>
  );
};

export default memo(DateRecap);
