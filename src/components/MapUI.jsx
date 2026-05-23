import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { LOCATIONS } from '../data/locations';
import { ITEMS } from '../state/ItemDatabase';
import { NPCS } from '../state/NpcDatabase';
import './MapUI.css';

// Absolute percentage coordinates corresponding to visual locations on map.jpg
const MAP_COORDINATES = {
  gym: { top: '38%', left: '38%' },      // Commercial block left of clock tower (was 26%, 21% near school track)
  park: { top: '55%', left: '11%' },     // Serene pond & forest (middle left)
  library: { top: '62%', left: '65%' },  // Neoclassical columns building
  office: { top: '20%', left: '79%' },   // High-rise skyscraper (top right)
  club: { top: '80%', left: '46%' },     // Purple neon venue (bottom center)
  mall: { top: '42%', left: '47%' }      // Dome shopping center (center map)
};

const MapUI = ({ onClose, onTalkNpc }) => {
  const { gameState, travelToLocation, buyItem } = useGame();
  const { activeLocation, stats, properties, matches } = gameState;

  // Track the selected pin location to display in the right panel details (defaults to current position)
  const [selectedLocKey, setSelectedLocKey] = useState(activeLocation);
  const [prevActiveLocation, setPrevActiveLocation] = useState(activeLocation);

  // Sync selected location when player travels (synchronously during render)
  if (activeLocation !== prevActiveLocation) {
    setPrevActiveLocation(activeLocation);
    setSelectedLocKey(activeLocation);
  }

  const handleTravel = (locKey) => {
    const success = travelToLocation(locKey);
    if (success) {
      setSelectedLocKey(locKey);
    }
  };

  // Find NPCs active at current location
  const getNpcsAtLocation = (locKey) => {
    if (locKey === 'home') return [];
    if (locKey === 'mall') return [];
    
    // Map NPC id to their primary location
    const npcLocationMap = {
      elena: 'library',
      brad: 'gym',
      sophia: 'club',
      marcus: 'office',
      chloe: 'park'
    };

    // Filter NPCs
    return NPCS.filter(npc => {
      const primaryLoc = npcLocationMap[npc.id];
      return primaryLoc === locKey;
    });
  };

  const activeNpcs = getNpcsAtLocation(selectedLocKey);
  const selectedLoc = LOCATIONS[selectedLocKey];

  return (
    <div className="glass-panel map-container animate-fade-in">
      <header className="map-header">
        <div>
          <h3 className="text-gradient">City Navigator</h3>
          <p className="map-subtitle">Click a map location pin to select a venue and travel or interact</p>
        </div>
        <button className="btn-mini btn-back" onClick={onClose}>Back to Hub</button>
      </header>

      <div className="map-layout">
        {/* Visual Map Section (Left side) */}
        <div className="map-visual-board glass-panel">
          <img src="/map.jpg" alt="Town Map" className="map-img-asset" />
          
          {/* Overlay Coordinates Hotspots */}
          {Object.entries(LOCATIONS).map(([key, loc]) => {
            const isActive = activeLocation === key;
            const isSelected = selectedLocKey === key;
            const isGated = loc.gated && !properties.vehicles.includes('sports_car') && stats.style < loc.reqStyle;
            const coords = MAP_COORDINATES[key] || { top: '50%', left: '50%' };

            return (
              <button
                key={key}
                className={`location-pin ${isActive ? 'current-here' : ''} ${isSelected ? 'selected-pin' : ''} ${isGated ? 'gated-pin' : ''}`}
                style={{ top: coords.top, left: coords.left }}
                onClick={() => setSelectedLocKey(key)}
                title={loc.name}
              >
                <div className="pin-marker">
                  {isGated ? "🔒" : (isActive ? "📍" : "🔵")}
                  <div className="pin-pulse"></div>
                </div>
                <span className="pin-label">{loc.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Location Details Section (Right side) */}
        <div className="location-details-section glass-panel">
          <div className="location-details-header">
            <h4 className="text-gradient">{selectedLoc.name}</h4>
            {activeLocation === selectedLocKey ? (
              <span className="here-badge-tag">📍 You Are Here</span>
            ) : (
              <span className="here-badge-tag inactive">Elsewhere</span>
            )}
          </div>
          
          <p className="location-desc-detail">{selectedLoc.desc}</p>
          <div className="location-cost-banner">
            <span>Travel Energy Required:</span>
            <strong>⚡ {selectedLoc.energyCost} Energy</strong>
          </div>

          {/* Travel Command (if elsewhere) */}
          {activeLocation !== selectedLocKey && (
            <div className="map-travel-action-box">
              {selectedLoc.gated && !properties.vehicles.includes('sports_car') && stats.style < selectedLoc.reqStyle ? (
                <div className="gated-lock-box">
                  <p className="lock-reason-title">🔒 ACCESS DENIED</p>
                  <p className="lock-reason-desc">{selectedLoc.reqDesc}</p>
                </div>
              ) : (
                <button
                  className="btn-primary btn-travel-large"
                  onClick={() => handleTravel(selectedLocKey)}
                  disabled={gameState.needs.energy < selectedLoc.energyCost}
                >
                  🚀 Travel to Location (⚡ {selectedLoc.energyCost})
                </button>
              )}
            </div>
          )}

          {/* Location Interactions (only accessible if currently there) */}
          {activeLocation === selectedLocKey && (
            <div className="location-interactive-area">
              <h5 className="interaction-title">Interactive Options</h5>
              
              {/* Home Detail Options */}
              {selectedLocKey === 'home' && (
                <div className="loc-interactive-content">
                  <p>Cozy up in your quarters. Sleep, cook, or customize your flat from the Dashboard.</p>
                  <div className="home-assets-preview">
                    <h6>Registered Assets</h6>
                    <div className="preview-grid">
                      <span>🏠 House Tier: {stats.housingTier}</span>
                      <span>🚗 Vehicles: {properties.vehicles.map(v => ITEMS[v]?.name).join(', ') || 'None'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mall Shop Options */}
              {selectedLocKey === 'mall' && (
                <div className="loc-interactive-content">
                  <p>Browse Avenue Mall appliance shops and premium items:</p>
                  <div className="shop-grid">
                    {Object.entries(ITEMS).map(([key, item]) => {
                      const ownsVehicle = item.type === 'vehicle' && properties.vehicles.includes(key);
                      const negotiationLevel = stats.negotiation || 10;
                      const discountPercent = Math.min(0.20, negotiationLevel * 0.002);
                      const discountedCost = Math.floor(item.cost * (1 - discountPercent));
                      const isAffordable = stats.money >= discountedCost;
                      
                      return (
                        <div key={key} className="shop-item-card">
                          <div className="shop-item-info">
                            <span className="shop-item-name">{item.name}</span>
                            <span className="shop-item-desc">{item.desc}</span>
                            <span className="shop-item-cost">
                              ${discountedCost}
                              {discountPercent > 0 && <span style={{ fontSize: '0.75rem', color: '#10b981', marginLeft: '0.4rem' }}>({Math.round(discountPercent * 100)}% Off)</span>}
                            </span>
                            {item.slots && <span className="shop-item-slots">Occupies: {item.slots} Slots</span>}
                          </div>
                          <button 
                            className="btn-mini btn-buy"
                            onClick={() => buyItem(key)}
                            disabled={ownsVehicle || !isAffordable}
                          >
                            {ownsVehicle ? "Owned" : "Buy"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* NPC Venues (Gym, Library, Club, Office, Park) */}
              {selectedLocKey !== 'home' && selectedLocKey !== 'mall' && (
                <div className="loc-interactive-content">
                  <p>Speak to people active here at this venue:</p>
                  <div className="npc-list-location">
                    {activeNpcs.map(npc => {
                      const isMatched = matches[npc.id];
                      return (
                        <div key={npc.id} className="location-npc-card">
                          <div className="npc-info-mini">
                            <span className="npc-name">{npc.name}</span>
                            <span className="npc-archetype-mini">{npc.description}</span>
                          </div>
                          <button 
                            className="btn-mini btn-talk"
                            onClick={() => onTalkNpc(npc.id)}
                          >
                            {isMatched ? "Chat" : "Introduce Yourself"}
                          </button>
                        </div>
                      );
                    })}
                    {activeNpcs.length === 0 && (
                      <p className="no-npcs-msg">No one is active at this venue right now.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapUI;
