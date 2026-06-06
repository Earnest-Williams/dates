import React from 'react';
import { useGameStore } from '../../state/store';
import { NPCS } from '../../data/npcs';

const CompatibilityPanel = () => {
  const gameState = useGameStore(state => state.gameState);
  const matches = gameState.matches || {};
  const compatibility = gameState.compatibility || {};
  const playerTraits = compatibility.playerTraits || {};

  // Get NPCs that have been met
  const metNpcs = Object.entries(matches)
    .filter(([npcId, match]) => match.met)
    .map(([npcId, match]) => ({ npcId, match }));

  // Calculate compatibility score for display
  const getCompatibilityScore = (npcId) => {
    const match = matches[npcId];
    if (!match || match.compatibilityScore === undefined) {
      return { score: 0, level: 'unknown', color: '#6b7280' };
    }
    
    const score = match.compatibilityScore || 50;
    let level = 'mixed';
    let color = '#fbbf24';
    
    if (score >= 80) { level = 'perfect'; color = '#10b981'; }
    else if (score >= 70) { level = 'strong'; color = '#34d399'; }
    else if (score >= 60) { level = 'good'; color = '#86efac'; }
    else if (score >= 40) { level = 'mixed'; color = '#fbbf24'; }
    else if (score >= 30) { level = 'fragile'; color = '#f87171'; }
    else { level = 'poor'; color = '#ef4444'; }
    
    return { score, level, color };
  };

  // Get compatibility hint text
  const getCompatibilityHint = (npcId) => {
    const match = matches[npcId];
    if (!match || match.compatibilityScore === undefined) {
      return 'Spend more time together to understand your compatibility.';
    }
    
    const score = match.compatibilityScore || 50;
    if (score >= 70) return 'You connect easily and your long-term goals align nicely.';
    if (score >= 40) return 'You have chemistry, but some long-term differences will require work.';
    if (score >= 30) return 'You enjoy each other, but fundamental differences keep causing friction.';
    return 'Significant differences may make long-term compatibility challenging.';
  };

  // Get trait comparison
  const getTraitComparison = (npcId) => {
    const npc = NPCS.find(n => n.id === npcId);
    if (!npc || !npc.hiddenCompatibilityTraits) return [];
    
    const npcTraits = npc.hiddenCompatibilityTraits;
    const comparisons = [];
    
    // Compare key traits
    const traitPairs = [
      { player: playerTraits.ambition, npc: npcTraits.ambitionLevel, label: 'Ambition' },
      { player: playerTraits.affectionStyle, npc: npcTraits.affectionStyle, label: 'Affection' },
      { player: playerTraits.conflictStyle, npc: npcTraits.conflictStyle, label: 'Conflict' },
      { player: playerTraits.spendingStyle, npc: npcTraits.spendingStyle, label: 'Spending' },
      { player: playerTraits.emotionalOpenness, npc: npcTraits.emotionalOpenness, label: 'Openness' },
    ];
    
    traitPairs.forEach(pair => {
      if (pair.player && pair.npc) {
        const matchLevel = pair.player === pair.npc ? 'perfect' : 
                          pair.player.includes(pair.npc.split('_')[0]) || pair.npc.includes(pair.player.split('_')[0]) ? 'good' : 'mixed';
        comparisons.push({ ...pair, matchLevel });
      }
    });
    
    return comparisons;
  };

  if (metNpcs.length === 0) {
    return (
      <div className="bento-card compatibility">
        <h2 className="section-title">Compatibility Insights</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          <p>No compatibility data yet.</p>
          <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
            Meet and spend time with NPCs to see your compatibility scores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bento-card compatibility">
      <h2 className="section-title">Compatibility Insights</h2>
      
      {/* Player Traits Summary */}
      <div style={{ 
        marginBottom: '1.5rem', 
        padding: '1rem', 
        background: 'rgba(0,0,0,0.2)', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)'
      }}>
        <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Your Relationship Style</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.entries(playerTraits).map(([trait, value]) => (
            <span key={trait} style={{ 
              padding: '0.4rem 0.8rem', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px',
              fontSize: '0.8rem',
              border: '1px solid var(--border-color)'
            }}>
              {trait.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {value.replace(/_/g, ' ')}
            </span>
          ))}
        </div>
      </div>

      {/* Compatibility List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {metNpcs.map(({ npcId, match }) => {
          const npc = NPCS.find(n => n.id === npcId);
          if (!npc) return null;
          
          const { score, level, color } = getCompatibilityScore(npcId);
          const hint = getCompatibilityHint(npcId);
          const traits = getTraitComparison(npcId);
          
          return (
            <div 
              key={npcId}
              style={{
                background: 'rgba(0,0,0,0.2)',
                padding: '1rem',
                borderRadius: '8px',
                border: `2px solid ${color}`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              title={hint}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{npc.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {npc.archetype || 'Unknown'}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem' }}>
                  {level === 'perfect' && '💖'}
                  {level === 'strong' && '💗'}
                  {level === 'good' && '💓'}
                  {level === 'mixed' && '💔'}
                  {level === 'fragile' && '😬'}
                  {level === 'poor' && '😵'}
                  {level === 'unknown' && '❓'}
                </div>
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <div style={{ 
                  fontSize: '0.8rem', 
                  color: color,
                  fontWeight: 'bold',
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem'
                }}>
                  <span>{score > 0 ? score : '?'}</span>
                  <span style={{ fontSize: '0.7rem' }}>/100</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {level.charAt(0).toUpperCase() + level.slice(1)} Match
                </div>
              </div>
              
              {/* Mini trait comparison */}
              {traits.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '0.25rem', 
                  marginTop: '0.5rem',
                  fontSize: '0.65rem'
                }}>
                  {traits.slice(0, 2).map(trait => (
                    <span 
                      key={trait.label}
                      style={{
                        padding: '0.2rem 0.4rem',
                        background: trait.matchLevel === 'perfect' ? 'rgba(16, 185, 129, 0.2)' : 
                                  trait.matchLevel === 'good' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                        borderRadius: '10px',
                        border: `1px solid ${trait.matchLevel === 'perfect' ? '#10b981' : trait.matchLevel === 'good' ? '#34d399' : '#fbbf24'}`
                      }}
                    >
                      {trait.label}
                    </span>
                  ))}
                  {traits.length > 2 && (
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)' }}>
                      +{traits.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compatibility Tips */}
      <div style={{ 
        marginTop: '1.5rem', 
        fontSize: '0.75rem', 
        color: 'var(--text-tertiary)',
        textAlign: 'center'
      }}>
        <em>💡 Compatibility scores improve as you spend time together and align on relationship values.</em>
      </div>
    </div>
  );
};

export default React.memo(CompatibilityPanel);