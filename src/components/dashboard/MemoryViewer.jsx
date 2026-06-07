import { useState } from 'react';
import { NPCS } from '../../data/npcs';
import './MemoryViewer.css';

const MemoryViewer = ({ gameState }) => {
  const [selectedNpcId, setSelectedNpcId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  const { relationshipMemory, matches } = gameState;
  
  // Get NPCs that have memories
  const npcWithMemories = Object.entries(relationshipMemory || {})
    .filter(([, memory]) => {
      return memory && (
        (memory.rememberedChoices?.length || 0) > 0 ||
        (memory.sharedActivities?.length || 0) > 0 ||
        (memory.importantMoments?.length || 0) > 0 ||
        (memory.comfortKnown?.length || 0) > 0 ||
        Object.keys(memory.promises || {}).length > 0
      );
    })
    .map(([npcId]) => {
      const npc = NPCS.find(n => n.id === npcId);
      return { id: npcId, ...npc };
    })
    .filter(npc => npc.id);

  // Sort by number of memories (descending)
  npcWithMemories.sort((a, b) => {
    const aMemCount = countMemories(relationshipMemory[a.id]);
    const bMemCount = countMemories(relationshipMemory[b.id]);
    return bMemCount - aMemCount;
  });

  const countMemories = (memory) => {
    if (!memory) return 0;
    return (
      (memory.rememberedChoices?.length || 0) +
      (memory.sharedActivities?.length || 0) +
      (memory.importantMoments?.length || 0) +
      (memory.comfortKnown?.length || 0) +
      Object.keys(memory.promises || {}).length
    );
  };

  const getMemoryIcon = (type) => {
    const icons = {
      rememberedChoices: '💭',
      sharedActivities: '🎭',
      importantMoments: '✨',
      comfortKnown: '💖',
      promises: '🤝',
    };
    return icons[type] || '📝';
  };

  const getMemoryColor = (type) => {
    const colors = {
      rememberedChoices: '#8b5cf6',
      sharedActivities: '#06b6d4',
      importantMoments: '#f59e0b',
      comfortKnown: '#ec4899',
      promises: '#10b981',
    };
    return colors[type] || '#9ca3af';
  };

  const getNpcName = (npcId) => {
    const npc = NPCS.find(n => n.id === npcId);
    return npc ? npc.name : npcId;
  };

  const getRelationshipLevel = (npcId) => {
    const match = matches[npcId];
    return match?.relationship || 0;
  };

  const handleSelectNpc = (npcId) => {
    setSelectedNpcId(npcId === selectedNpcId ? null : npcId);
  };

  // Filter memories by type
  const filteredMemories = selectedNpcId ? (
    Object.entries(relationshipMemory[selectedNpcId] || {})
      .filter(([type]) => filterType === 'all' || type === filterType)
      .flatMap(([type, items]) => {
        if (type === 'promises') {
          return Object.entries(items || {}).map(([key, status]) => ({
            type,
            key,
            value: `${key.replace(/_/g, ' ')} (${status})`,
          }));
        }
        if (Array.isArray(items)) {
          return items.map(item => ({ type, value: item }));
        }
        return [];
      })
  ) : [];

  const totalMemories = npcWithMemories.reduce((sum, npc) => sum + countMemories(relationshipMemory[npc.id]), 0);

  if (npcWithMemories.length === 0) {
    return (
      <div className="bento-card memory-viewer">
        <h2 className="section-title">Memory Viewer</h2>
        <p style={{ opacity: 0.65, textAlign: 'center', padding: '2rem' }}>
          No memories yet. Go on dates and have conversations to create lasting memories!
        </p>
      </div>
    );
  }

  return (
    <div className="bento-card memory-viewer">
      <h2 className="section-title">Memory Viewer</h2>
      
      <p style={{ opacity: 0.78, marginTop: -6, marginBottom: 12 }}>
        {totalMemories} total memor{totalMemories !== 1 ? 'ies' : 'y'} across {npcWithMemories.length} relationship{npcWithMemories.length !== 1 ? 's' : ''}
      </p>

      {!selectedNpcId ? (
        <>
          {/* Memory type filter */}
          <div className="memory-filter">
            <button 
              className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              All Types
            </button>
            <button 
              className={`filter-btn ${filterType === 'rememberedChoices' ? 'active' : ''}`}
              onClick={() => setFilterType('rememberedChoices')}
            >
              Choices
            </button>
            <button 
              className={`filter-btn ${filterType === 'sharedActivities' ? 'active' : ''}`}
              onClick={() => setFilterType('sharedActivities')}
            >
              Activities
            </button>
            <button 
              className={`filter-btn ${filterType === 'importantMoments' ? 'active' : ''}`}
              onClick={() => setFilterType('importantMoments')}
            >
              Moments
            </button>
            <button 
              className={`filter-btn ${filterType === 'comfortKnown' ? 'active' : ''}`}
              onClick={() => setFilterType('comfortKnown')}
            >
              Comfort
            </button>
            <button 
              className={`filter-btn ${filterType === 'promises' ? 'active' : ''}`}
              onClick={() => setFilterType('promises')}
            >
              Promises
            </button>
          </div>

          {/* NPC list with memory counts */}
          <div className="npc-memory-list">
            {npcWithMemories.map(npc => {
              const memory = relationshipMemory[npc.id];
              const memCount = countMemories(memory);
              const relLevel = getRelationshipLevel(npc.id);
              
              return (
                <div 
                  key={npc.id}
                  className="npc-memory-card"
                  onClick={() => handleSelectNpc(npc.id)}
                >
                  <div className="npc-memory-header">
                    <span className="npc-memory-name">{npc.name}</span>
                    <span className="npc-memory-count">{memCount} memor{memCount !== 1 ? 'ies' : 'y'}</span>
                  </div>
                  <div className="memory-types-breakdown">
                    {memory.rememberedChoices?.length > 0 && (
                      <span className="memory-type-badge" style={{ backgroundColor: getMemoryColor('rememberedChoices') }}>
                        {getMemoryIcon('rememberedChoices')} {memory.rememberedChoices.length}
                      </span>
                    )}
                    {memory.sharedActivities?.length > 0 && (
                      <span className="memory-type-badge" style={{ backgroundColor: getMemoryColor('sharedActivities') }}>
                        {getMemoryIcon('sharedActivities')} {memory.sharedActivities.length}
                      </span>
                    )}
                    {memory.importantMoments?.length > 0 && (
                      <span className="memory-type-badge" style={{ backgroundColor: getMemoryColor('importantMoments') }}>
                        {getMemoryIcon('importantMoments')} {memory.importantMoments.length}
                      </span>
                    )}
                    {memory.comfortKnown?.length > 0 && (
                      <span className="memory-type-badge" style={{ backgroundColor: getMemoryColor('comfortKnown') }}>
                        {getMemoryIcon('comfortKnown')} {memory.comfortKnown.length}
                      </span>
                    )}
                    {Object.keys(memory.promises || {}).length > 0 && (
                      <span className="memory-type-badge" style={{ backgroundColor: getMemoryColor('promises') }}>
                        {getMemoryIcon('promises')} {Object.keys(memory.promises).length}
                      </span>
                    )}
                  </div>
                  <div className="relationship-indicator">
                    <div className="rel-bar">
                      <div 
                        className="rel-fill"
                        style={{ width: `${Math.min(100, relLevel)}%` }}
                      />
                    </div>
                    <span className="rel-value">{relLevel}%</span>
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
            ← Back to All Memories
          </button>
          
          <div className="npc-detail-header">
            <h3>{getNpcName(selectedNpcId)}</h3>
            <p style={{ opacity: 0.7 }}>
              {countMemories(relationshipMemory[selectedNpcId])} memor{countMemories(relationshipMemory[selectedNpcId]) !== 1 ? 'ies' : 'y'}
            </p>
          </div>

          {/* Individual memories */}
          <div className="memories-list">
            {filteredMemories.length > 0 ? (
              filteredMemories.map((memory, index) => (
                <div 
                  key={`${memory.type}-${index}`}
                  className="memory-item"
                  style={{ borderLeftColor: getMemoryColor(memory.type) }}
                >
                  <div className="memory-icon" style={{ color: getMemoryColor(memory.type) }}>
                    {getMemoryIcon(memory.type)}
                  </div>
                  <div className="memory-content">
                    <span className="memory-type">{memory.type.replace(/([A-Z])/g, ' $1').replace(/^ /, '')}</span>
                    <span className="memory-value">{memory.value.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ opacity: 0.65, textAlign: 'center', padding: '2rem' }}>
                No memories of this type found.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(MemoryViewer);
