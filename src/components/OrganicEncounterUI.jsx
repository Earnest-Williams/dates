import { useGameStore } from '../state/store';
import { NPCS } from '../data/npcs';
import { ARCHETYPES } from '../data/npcs';

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

  // Get NPC archetype info
  const archetype = npc.archetype ? ARCHETYPES[npc.archetype] : null;
  const matches = gameState.matches || {};
  const existingMatch = matches[npc.id];

  // Calculate potential gains from this encounter
  const getPotentialGains = () => {
    if (!existingMatch) return { relationship: 'New connection', chemistry: 'First impression' };
    return {
      relationship: `+${defaultChoices[0].relationship || 5} to current ${existingMatch.relationship || 0}`,
      chemistry: `+${defaultChoices[0].chemistry || 5} to current ${existingMatch.chemistry || 0}`
    };
  };

  const gains = getPotentialGains();

  return (
    <div className="glass-panel animate-fade-in organic-encounter" style={{ 
      padding: '20px', 
      color: 'white', 
      maxWidth: '640px', 
      margin: '40px auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)'
    }}>
      <header style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
        <h2 style={{ color: 'var(--accent-pink)', marginBottom: '0.5rem' }}>🌟 Organic Encounter</h2>
        <p style={{ fontSize: '1.1rem' }}>You bump into {npc.name} at the {encounter.location}.</p>
        
        {/* NPC Info Card */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          background: 'rgba(0,0,0,0.3)', 
          borderRadius: '8px',
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{npc.name}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {npc.archetype && archetype ? archetype.name : npc.description}
            </div>
          </div>
          
          {existingMatch && (
            <div style={{ 
              padding: '0.5rem 1rem', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px',
              fontSize: '0.8rem'
            }}>
              <div><strong>Current:</strong> Rel: {existingMatch.relationship || 0}, Chem: {existingMatch.chemistry || 0}</div>
            </div>
          )}
        </div>
      </header>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', fontSize: '1.1rem', lineHeight: '1.5' }}>
        <p>{encounter.scenario || `You noticed ${npc.name} here. They seem busy with their routine.`}</p>
        {encounter.reveals && (
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#60a5fa' }}>
            👀 You notice something about their {encounter.reveals.replace(/_/g, ' ')}.
          </p>
        )}
        
        {/* Potential gains info */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: 'rgba(59, 130, 246, 0.1)', 
          borderRadius: '6px',
          fontSize: '0.9rem'
        }}>
          <strong>Potential Gains:</strong> {gains.relationship} | {gains.chemistry}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h4 style={{ margin: 0, color: 'var(--text-secondary)' }}>How do you react?</h4>
        {defaultChoices.map((choice, index) => {
          const hasDiscovery = choice.discovery || false;
          const hasRepair = choice.repairScene || false;
          const hasConflict = choice.conflict || false;
          
          return (
            <button 
              key={index}
              className="btn-primary organic-choice" 
              onClick={() => resolveOrganicEncounter(index)}
              style={{ 
                textAlign: 'left', 
                padding: '1rem', 
                background: 'rgba(59, 130, 246, 0.2)', 
                border: '1px solid rgba(59, 130, 246, 0.5)',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{choice.text}</div>
              {choice.relationship && (
                <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '0.25rem' }}>
                  +{choice.relationship} Relationship, +{choice.chemistry || 0} Chemistry
                </div>
              )}
              {hasDiscovery && (
                <div style={{ fontSize: '0.8rem', color: '#7bed9f', marginTop: '0.25rem' }}>
                  🔍 May reveal character information
                </div>
              )}
              {hasRepair && (
                <div style={{ fontSize: '0.8rem', color: '#ffb86c', marginTop: '0.25rem' }}>
                  ⚠️ Could create tension
                </div>
              )}
              {hasConflict && (
                <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '0.25rem' }}>
                  ❌ Risk of conflict
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ 
        fontSize: '0.8rem', 
        color: 'var(--text-tertiary)', 
        textAlign: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <em>💡 Organic encounters build relationships naturally and can reveal hidden traits.</em>
      </div>
    </div>
  );
};

export default OrganicEncounterUI;
