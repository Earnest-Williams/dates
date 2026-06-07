import { useGameStore } from '../state/store';
import { NPCS } from '../data/npcs';
import { formatOrganicEncounterRewardSummary } from './organicEncounterRewards';

const OrganicEncounterUI = () => {
  const { gameState, resolveOrganicEncounter } = useGameStore();
  const encounter = gameState.activeEncounterEvent;

  if (!encounter) return null;

  const npc = NPCS.find(n => n.id === encounter.npcId);
  if (!npc) return null;

  const defaultChoices = encounter.choices || [
    { text: "Say hello", relationship: 5, chemistry: 5 },
    { text: "Just nod and pass by", relationship: 1, chemistry: 0 },
  ];

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '20px', color: 'white', maxWidth: '640px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>Unexpected Encounter</h2>
        <p style={{ fontSize: '1.1rem' }}>You bump into {npc.name} at the {encounter.location}.</p>
      </header>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', fontSize: '1.1rem', lineHeight: '1.5' }}>
        <p>{encounter.scenario || `You noticed ${npc.name} here. They seem busy with their routine.`}</p>
        {encounter.reveals && (
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#60a5fa' }}>
            You notice something about their {encounter.reveals.replace(/_/g, ' ')}.
          </p>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, color: 'var(--text-secondary)' }}>How do you react?</h4>
        {defaultChoices.map((choice, index) => (
          <button 
            key={index}
            className="btn-primary" 
            onClick={() => resolveOrganicEncounter(index)}
            style={{ textAlign: 'left', padding: '1rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.5)' }}
          >
            <div style={{ fontWeight: 'bold' }}>{choice.text}</div>
            {formatOrganicEncounterRewardSummary(choice) && (
              <div style={{ fontSize: '0.8rem', color: '#c4b5fd', marginTop: '0.25rem' }}>
                {formatOrganicEncounterRewardSummary(choice)}
              </div>
            )}
            {choice.discovery && <div style={{ fontSize: '0.8rem', color: '#7bed9f', marginTop: '0.25rem' }}>May reveal character information</div>}
            {choice.repairScene && <div style={{ fontSize: '0.8rem', color: '#ffb86c', marginTop: '0.25rem' }}>Could create tension</div>}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrganicEncounterUI;
