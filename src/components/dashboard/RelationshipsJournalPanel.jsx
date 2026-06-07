import { useState } from 'react';
import { RelationshipJournal } from '../journal/RelationshipJournal';
import { NPCS } from '../../data/npcs';
import './RelationshipsJournalPanel.css';

const RelationshipsJournalPanel = ({ gameState }) => {
  const [selectedNpcId, setSelectedNpcId] = useState(null);
  
  const { matches } = gameState;
  
  // Get NPCs that have been met
  const metNPCs = Object.entries(matches || {})
    .filter(([, match]) => match.met)
    .map(([npcId]) => {
      const npc = NPCS.find(n => n.id === npcId);
      return { id: npcId, ...npc };
    })
    .filter(npc => npc.id); // Filter out any null/undefined

  // Sort by relationship level (descending)
  metNPCs.sort((a, b) => {
    const aRel = matches[a.id]?.relationship || 0;
    const bRel = matches[b.id]?.relationship || 0;
    return bRel - aRel;
  });

  const handleSelectNpc = (npcId) => {
    setSelectedNpcId(npcId === selectedNpcId ? null : npcId);
  };

  const getRelationshipStatus = (npcId) => {
    const match = matches[npcId];
    if (!match) return 'Unknown';
    
    if (match.relationship >= 90) return 'Soulmates';
    if (match.relationship >= 70) return 'In Love';
    if (match.relationship >= 50) return 'Serious';
    if (match.relationship >= 30) return 'Dating';
    if (match.relationship >= 10) return 'Getting to Know';
    return 'Met';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Soulmates': '#ec4899',
      'In Love': '#f472b6',
      'Serious': '#f97316',
      'Dating': '#fbbf24',
      'Getting to Know': '#a3e635',
      'Met': '#6b7280',
      'Unknown': '#9ca3af',
    };
    return colors[status] || '#9ca3af';
  };

  if (metNPCs.length === 0) {
    return (
      <div className="bento-card relationships-journal">
        <h2 className="section-title">Relationship Journal</h2>
        <p style={{ opacity: 0.65, textAlign: 'center', padding: '2rem' }}>
          No relationships yet. Swipe on LinkUp to meet someone!
        </p>
      </div>
    );
  }

  return (
    <div className="bento-card relationships-journal">
      <h2 className="section-title">Relationship Journal</h2>
      
      {!selectedNpcId ? (
        <>
          <p style={{ opacity: 0.78, marginTop: -6, marginBottom: 12 }}>
            {metNPCs.length} relationship{metNPCs.length !== 1 ? 's' : ''} tracked
          </p>
          
          <div className="npc-grid">
            {metNPCs.map(npc => {
              const status = getRelationshipStatus(npc.id);
              const color = getStatusColor(status);
              const relationship = matches[npc.id]?.relationship || 0;
              
              return (
                <div 
                  key={npc.id}
                  className="npc-card"
                  onClick={() => handleSelectNpc(npc.id)}
                  style={{ borderColor: color }}
                >
                  <div className="npc-avatar" style={{ backgroundColor: color }}>
                    {npc.avatar || '👤'}
                  </div>
                  <div className="npc-info">
                    <div className="npc-name">{npc.name}</div>
                    <div className="npc-status">
                      <span className="status-badge" style={{ backgroundColor: color }}>
                        {status}
                      </span>
                    </div>
                    <div className="relationship-bar">
                      <div 
                        className="relationship-fill"
                        style={{ 
                          width: `${Math.min(100, relationship)}%`,
                          backgroundColor: color 
                        }}
                      />
                    </div>
                    <div className="relationship-value">{relationship}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <button 
            className="btn-secondary btn-small"
            onClick={() => setSelectedNpcId(null)}
            style={{ marginBottom: '1rem' }}
          >
            ← Back to All Relationships
          </button>
          <RelationshipJournal npcId={selectedNpcId} />
        </>
      )}
    </div>
  );
};

export default RelationshipsJournalPanel;
