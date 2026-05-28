import React from 'react';
import { useGameStore } from '../../state/store';
import { HOUSING_TIERS } from '../../data/housing';
import { ITEMS } from '../../state/ItemDatabase';

const HousingPanel = () => {
  const stats = useGameStore(state => state.gameState.stats);
  const placedFurniture = useGameStore(state => state.gameState.placedFurniture) || [];
  const upgradeHousing = useGameStore(state => state.upgradeHousing);

  const { housingTier, money } = stats;
  const currentHousing = HOUSING_TIERS[housingTier];
  
  const occupiedSlots = placedFurniture.reduce((sum, id) => sum + (ITEMS[id]?.slots || 0), 0);
  const placedBed = placedFurniture.find(id => ITEMS[id]?.category === 'bed');
  const bedName = placedBed ? ITEMS[placedBed].name : "None (Floor/Couch)";
  const sleepMultiplier = placedBed && ITEMS[placedBed] ? ITEMS[placedBed].energyMultiplier : 1.0;

  return (
    <div className="bento-card housing">
      <h2 className="section-title">Housing: {currentHousing.name}</h2>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p>{currentHousing.desc}</p>
        {housingTier > 0 && <p style={{ marginTop: '0.5rem', color: '#f87171' }}>Rent: ${currentHousing.rent}/week</p>}
        <p>Bed: {bedName} (x{sleepMultiplier.toFixed(2)} Energy)</p>
        <p>Capacity: {occupiedSlots} / {currentHousing.slots} Slots</p>
        
        {housingTier < HOUSING_TIERS.length - 1 && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--border-color)' }}>
            <p style={{ marginBottom: '5px' }}>Next Tier: {HOUSING_TIERS[housingTier + 1].name}</p>
            <p style={{ marginBottom: '10px' }}>Move-in Cost: ${HOUSING_TIERS[housingTier + 1].rent * 2}</p>
            <button 
              className="btn-secondary" 
              onClick={upgradeHousing}
              disabled={money < (HOUSING_TIERS[housingTier + 1].rent * 2)}
            >
              Upgrade Housing
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(HousingPanel);
