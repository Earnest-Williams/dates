import React from 'react';
import { useGameStore } from '../../state/store';
import { ITEMS } from '../../state/ItemDatabase';
import { HOUSING_TIERS } from '../../data/housing';
import { NPCS } from '../../data/npcs';
import { getNpcHomeStyleReaction } from '../../data/furniture';

const FurnitureManager = () => {
  const gameState = useGameStore(state => state.gameState);
  const sleep = useGameStore(state => state.sleep);
  const eat = useGameStore(state => state.eat);
  const storeFurniture = useGameStore(state => state.storeFurniture);
  const watchTv = useGameStore(state => state.watchTv);

  const { money, housingTier } = gameState.stats;
  const { utilitiesActive } = gameState.living;
  const currentHousing = HOUSING_TIERS[housingTier];

  const placedItems = gameState.placedFurniture || [];
  const occupiedSlots = placedItems.reduce((sum, id) => sum + (ITEMS[id]?.slots || 0), 0);

  const hasGasRange = placedItems.includes('gas_range');
  const hasHotPlate = placedItems.includes('hot_plate');
  const hasSmartFridge = placedItems.includes('smart_fridge');

  let groceryCost = 0;
  if (hasGasRange) {
    groceryCost = hasSmartFridge ? 5 : 10;
  } else if (hasHotPlate) {
    groceryCost = hasSmartFridge ? 2.5 : 5;
  }

  const gridCells = [];

  if (gameState.living.roommateId) {
    const roommate = NPCS.find(n => n.id === gameState.living.roommateId);
    gridCells.push({
      key: `roommate-${roommate.id}`,
      isRoommate: true,
      name: roommate.name,
      slots: 1
    });
  }

  placedItems.forEach((itemKey, idx) => {
    const item = ITEMS[itemKey];
    if (item) {
      gridCells.push({
        key: `placed-${itemKey}-${idx}`,
        item,
        itemKey,
        isPlaced: true,
        slots: item.slots
      });
    }
  });

  const totalOccupied = gridCells.reduce((sum, cell) => sum + cell.slots, 0);
  const remainingSlots = Math.max(0, currentHousing.slots - totalOccupied);

  for (let i = 0; i < remainingSlots; i++) {
    gridCells.push({
      key: `empty-${i}`,
      isPlaced: false,
      slots: 1
    });
  }

  const getItemIcon = (itemKey) => {
    if (itemKey.includes('bed')) return '🛏️';
    if (itemKey.includes('stove') || itemKey === 'hot_plate' || itemKey === 'gas_range') return '🍳';
    if (itemKey === 'smart_fridge') return '❄️';
    if (itemKey === 'bookshelf') return '📚';
    if (itemKey === 'smart_tv') return '📺';
    if (itemKey === 'luxury_painting') return '🖼️';
    return '📦';
  };

  const getItemEffectText = (item) => {
    if (item.category === 'bed') return `+${Math.round((item.energyMultiplier - 1.0) * 100)}% Energy recovery`;
    if (item.id === 'hot_plate') return 'Cook basic meal';
    if (item.id === 'gas_range') return 'Cook premium meal (+15 Mood)';
    if (item.id === 'smart_fridge') return 'Grocery bills: -50%';
    if (item.id === 'bookshelf') return 'Study gains: +25%';
    if (item.id === 'smart_tv') return 'Restores +30 Mood';
    if (item.id === 'luxury_painting') return '+5 Style & Charm';
    return '';
  };

  return (
    <div className="bento-card furniture">
      <h2 className="section-title">Home Layout & Storage</h2>
      <div className="furniture-manager-grid">
        <div className="apartment-layout-card">
          <h3 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Apartment View ({occupiedSlots} / {currentHousing.slots} Slots)
          </h3>
          
          <div className="apartment-grid">
            {housingTier === 0 ? (
              <div className="apartment-cell couch-cell">
                <span className="cell-icon">🛋️</span>
                <span className="cell-name">Mom & Dad's Couch</span>
                <span className="cell-desc">No slots for furniture. Upgrade housing to rent an apartment!</span>
              </div>
            ) : (
              gridCells.map((cell) => {
                if (cell.isRoommate) {
                  return (
                    <div key={cell.key} className="apartment-cell occupied" style={{ gridColumn: `span ${cell.slots}` }}>
                      <span className="cell-icon">🧍</span>
                      <span className="cell-name">{cell.name} (Roommate)</span>
                      <span className="cell-desc">Splits rent and triggers events.</span>
                    </div>
                  );
                } else if (cell.isPlaced) {
                  const itemIcon = getItemIcon(cell.itemKey);
                  const effectText = getItemEffectText(cell.item);
                  
                  return (
                    <div key={cell.key} className={`apartment-cell placed ${cell.slots > 1 ? 'span-2' : ''}`}>
                      <div>
                        <span className="cell-icon">{itemIcon}</span>
                        <span className="cell-name">{cell.item.name}</span>
                        {effectText && <span className="cell-effect-badge">{effectText}</span>}
                      </div>
                      
                      <div className="cell-actions">
                        {cell.item.category === 'bed' && (
                          <button className="btn-cell-action" onClick={() => sleep(8)}>
                            🛏️ Sleep (8h)
                          </button>
                        )}
                        {(cell.itemKey === 'hot_plate' || cell.itemKey === 'gas_range') && (
                          <button 
                            className="btn-cell-action" 
                            onClick={() => eat('cook')} 
                            disabled={money < groceryCost || !utilitiesActive}
                          >
                            🍳 Cook
                          </button>
                        )}
                        {cell.itemKey === 'smart_tv' && (
                          <button 
                            className="btn-cell-action" 
                            onClick={watchTv} 
                            disabled={!utilitiesActive}
                          >
                            📺 Watch TV
                          </button>
                        )}
                        <button className="btn-cell-store" onClick={() => storeFurniture(cell.itemKey)}>
                          Store
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={cell.key} className="apartment-cell empty">
                      <span className="cell-icon" style={{ opacity: 0.2 }}>📦</span>
                      <span className="cell-name" style={{ color: 'var(--text-tertiary)' }}>Empty Space</span>
                    </div>
                  );
                }
              })
            )}
          </div>
        </div>

        {housingTier > 0 && (
          <div className="home-identity-card" style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Home Identity & NPC Impressions</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              Your placed furniture creates a specific vibe. When you invite someone over, their reaction affects your starting connection.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem' }}>
              {NPCS.filter(n => gameState.matches && gameState.matches[n.id] && gameState.matches[n.id].met).map(npc => {
                const reaction = getNpcHomeStyleReaction(npc.id, placedItems);
                let color = 'var(--text-secondary)';
                if (reaction.fit === 'comfortable') color = '#34d399';
                if (reaction.fit === 'curious') color = '#fbbf24';
                if (reaction.fit === 'clashing') color = '#f87171';
                
                return (
                  <div key={npc.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px', borderLeft: `3px solid ${color}` }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{npc.name}</div>
                    <div style={{ fontSize: '0.75rem', color: color }}>
                      {reaction.fit.charAt(0).toUpperCase() + reaction.fit.slice(1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FurnitureManager);
