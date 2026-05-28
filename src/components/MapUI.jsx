import { useState, useEffect } from 'react';
import { useGameStore } from '../state/store';
import { ITEMS } from '../state/ItemDatabase';
import { HOUSING_TIERS } from '../data/housing';
import { NPCS } from '../state/NpcDatabase';
import { courses } from '../data/education';
import { 
  SETTLEMENTS, 
  ROADS, 
  calculateTravelStats, 
  computeSettlementMetrics 
} from '../data/geography';
import { getNpcEncounters } from '../data/townTexture';
import './MapUI.css';

const MapUI = ({ onClose, onTalkNpc }) => {
  const { 
    gameState, 
    travelToLocation, 
    buyItem, 
    enrollCourse, 
    enrollCourseWithLoan, 
    studyCourse,
    performAction,
    workOnProject,
    startOrganicEncounter
  } = useGameStore();

  const { activeLocation, stats, properties, matches, education, placedFurniture } = gameState;

  // Helper to check housing location
  const getHomeSettlement = (tier) => {
    if (tier === 0) return 'Endleigh';
    if (tier === 1) return 'Bramblewick';
    if (tier === 2) return 'Stagborough';
    return 'Brockleigh'; // Tier 3
  };

  const currentHomeSettlement = getHomeSettlement(stats.housingTier);

  // Address Book state loaded from localStorage (defaulting to preset locations)
  const [pinnedLocations, setPinnedLocations] = useState(() => {
    const defaultPins = [
      { id: 'home', name: 'My Flat', settlementKey: currentHomeSettlement, venueKey: 'home', icon: '🏠' },
      { id: 'university', name: 'University', settlementKey: 'Brockleigh', venueKey: 'university', icon: '🎓' },
      { id: 'mall', name: 'Avenue Mall', settlementKey: 'Stagborough', venueKey: 'mall', icon: '🛍️' },
      { id: 'gym', name: 'Peak Gym', settlementKey: 'Stagborough', venueKey: 'gym', icon: '💪' },
      { id: 'park', name: 'Greenwood Park', settlementKey: 'Bramblewick', venueKey: 'park', icon: '🌳' }
    ];
    const saved = localStorage.getItem('brockleighshire_pins');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error("Failed to load pins:", error);
        return defaultPins;
      }
    }
    return defaultPins;
  });

  // Keep home pin's settlementKey synchronized dynamically with housing tier moves
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPinnedLocations(prev => {
      let changed = false;
      const updated = prev.map(pin => {
        if (pin.venueKey === 'home' && pin.settlementKey !== currentHomeSettlement) {
          changed = true;
          return { ...pin, settlementKey: currentHomeSettlement };
        }
        return pin;
      });
      if (changed) {
        localStorage.setItem('brockleighshire_pins', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  }, [currentHomeSettlement]);

  // Selected settlement node (defaults to where player currently is)
  const [selectedLocKey, setSelectedLocKey] = useState(activeLocation);
  
  // Tab inside selected settlement
  const [activeTab, setActiveTab] = useState('info');

  // Track currently active pub/cafe selected by the player
  const [selectedDiningKey, setSelectedDiningKey] = useState(null);

  // Compute travel details from current location to selected
  const travelStats = calculateTravelStats(activeLocation, selectedLocKey, properties.vehicles);
  const selectedSettlement = SETTLEMENTS[selectedLocKey];

  // Compute county-wide accessibility metrics for selected settlement
  const metrics = computeSettlementMetrics(selectedLocKey);

  const handleSelectNode = (key) => {
    setSelectedLocKey(key);
    setActiveTab('info'); // Reset to info tab on selection
    setSelectedDiningKey(null); // Reset dining selection
  };

  const handleTravel = (key) => {
    const success = travelToLocation(key);
    if (success) {
      setSelectedLocKey(key);
      setActiveTab('info');
      setSelectedDiningKey(null);
    }
  };

  // Fast Travel handler for Address Book shortcuts
  const handleFastTravel = (pin) => {
    const targetSettlement = pin.settlementKey;
    if (activeLocation !== targetSettlement) {
      const success = travelToLocation(targetSettlement);
      if (!success) return; // Travel failed (e.g. low energy)
    }
    setSelectedLocKey(targetSettlement);
    setActiveTab(pin.venueKey);
    if (pin.diningKey) {
      setSelectedDiningKey(pin.diningKey);
    } else {
      setSelectedDiningKey(null);
    }
  };

  // Pin Toggle Helper
  const getVenueIcon = (venueKey) => {
    const map = {
      university: '🎓',
      library: '📖',
      office: '💼',
      mall: '🛍️',
      gym: '💪',
      club: '🍸',
      park: '🌳',
      home: '🏠',
      dining: '🍺'
    };
    return map[venueKey] || '📍';
  };

  const isVenuePinned = (venueKey, diningKey = null) => {
    return pinnedLocations.some(pin => {
      if (pin.settlementKey !== selectedLocKey) return false;
      if (pin.venueKey !== venueKey) return false;
      if (diningKey) {
        return pin.diningKey?.name === diningKey.name;
      }
      return true;
    });
  };

  const togglePinVenue = (venueKey, venueLabel, diningKey = null) => {
    const alreadyPinned = isVenuePinned(venueKey, diningKey);
    let updated;

    if (alreadyPinned) {
      updated = pinnedLocations.filter(pin => {
        if (pin.settlementKey !== selectedLocKey) return true;
        if (pin.venueKey !== venueKey) return true;
        if (diningKey) {
          return pin.diningKey?.name !== diningKey.name;
        }
        return false;
      });
    } else {
      const newPin = {
        id: diningKey ? `${selectedLocKey}_dining_${diningKey.name}` : `${selectedLocKey}_${venueKey}`,
        name: diningKey ? diningKey.name : venueLabel,
        settlementKey: selectedLocKey,
        venueKey,
        icon: diningKey ? (diningKey.type === 'pub' ? '🍺' : '☕') : getVenueIcon(venueKey),
        diningKey: diningKey
      };
      updated = [...pinnedLocations, newPin];
    }

    setPinnedLocations(updated);
    localStorage.setItem('brockleighshire_pins', JSON.stringify(updated));
  };

  // Determine which NPCs are active at the selected settlement and venue
  const activeEncounters = activeLocation === selectedLocKey ? getNpcEncounters(gameState.time, activeTab === 'info' ? 'park' : activeTab) : [];

  const isPlayerHomeHere = selectedLocKey === currentHomeSettlement;

  // Custom Local Activities handlers
  const handleLocalActivity = (type) => {
    if (type === 'hunt') {
      const gotBuck = Math.random() < 0.4;
      const earnings = gotBuck ? 120 : 0;
      const actName = gotBuck ? "Hunted in Stagborough Chase (Got a Prize Buck!)" : "Hunted in Stagborough Chase (No buck found)";
      performAction(actName, 12, { fitness: 1, confidence: 1, mood: 20 }, 25, earnings);
    } else if (type === 'mire') {
      performAction("Explored the Endleigh Mire Paths", 6, { creativity: 2, mood: 10, fitness: 0.5 }, 10, 0);
    } else if (type === 'reed') {
      performAction("Cut Reeds in Willow Fen", 12, { fitness: 0.5 }, 20, 45);
    } else if (type === 'drainage') {
      performAction("Inspected the Harrowfen Drainage Works", 6, { intelligence: 1, confidence: 1 }, 10, 0);
    } else if (type === 'barrow') {
      performAction("Explored the Stillwater Ancient Barrow", 12, { intelligence: 2, confidence: 1 }, 20, 0);
    } else if (type === 'forest') {
      performAction("Foraged in Durnthorne Forest", 8, { intelligence: 1, fitness: 1, mood: 10 }, 15, 0);
    } else if (type === 'heath') {
      performAction("Hiked the Blackmere Heath", 6, { fitness: 1.5, mood: 10 }, 10, 0);
    } else if (type === 'shrine') {
      performAction("Meditated at Fallowmere Woodland Shrine", 6, { empathy: 2, mood: 15 }, 10, 0);
    } else if (type === 'hike') {
      performAction("Hiked the Eldersley Grassy Rise", 6, { fitness: 1, confidence: 1, mood: 5 }, 10, 0);
    } else if (type === 'park') {
      performAction("Walked in Bramblewick Greenwood Park", 3, { empathy: 1, mood: 10 }, 5, 0);
    }
  };

  // Pub and Cafe actions handlers
  const handlePubAction = (pubName, actionType) => {
    if (actionType === 'drink') {
      performAction(`Drank a pint of local ale at ${pubName}`, 3, { mood: 15 }, -20, -8);
    } else if (actionType === 'chat') {
      performAction(`Chatted with locals at ${pubName}`, 6, { socialIq: 1, confidence: 1 }, 10, 0);
    }
  };

  const handleCafeAction = (cafeName, actionType) => {
    if (actionType === 'coffee') {
      performAction(`Bought coffee & pastry at ${cafeName}`, 3, { mood: 10 }, -15, -6);
    } else if (actionType === 'study') {
      performAction(`Studied on laptop at ${cafeName}`, 6, { intelligence: 1, programming: 0.5, creativity: 0.5 }, 10, 0);
    }
  };

  return (
    <div className="glass-panel map-container animate-fade-in">
      <header className="map-header">
        <div>
          <h3 className="text-gradient">Brockleighshire Navigator</h3>
          <p className="map-subtitle">Click a community node to view routing cost and local actions</p>
        </div>
        <button className="btn-mini btn-back" onClick={onClose}>Back to Hub</button>
      </header>

      <div className="map-layout">
        {/* Left Column: Visual Vector Map Cartography */}
        <div className="map-visual-board glass-panel">
          <svg className="map-vector-overlay" viewBox="0 0 135 95">
            {ROADS.map((road) => {
              const pointsStr = road.path.map(coord => coord.join(',')).join(' ');
              const isHighlighted = travelStats && travelStats.roads.some(r => r.name === road.name);
              const isExcluded = road.passable === false || road.blocks_edge === true;

              return (
                <polyline
                  key={road.name}
                  points={pointsStr}
                  className={`vector-road road-surface-${road.road_surface_key} ${isHighlighted ? 'highlighted-route' : ''} ${isExcluded ? 'excluded-route' : ''}`}
                  title={`${road.name} (${road.distance_km} km)`}
                />
              );
            })}
          </svg>

          {/* Settlement Pins */}
          {Object.entries(SETTLEMENTS).map(([key, node]) => {
            const isActive = activeLocation === key;
            const isSelected = selectedLocKey === key;
            const isHomeNode = key === currentHomeSettlement;

            return (
              <button
                key={key}
                className={`location-pin ${isActive ? 'current-here' : ''} ${isSelected ? 'selected-pin' : ''}`}
                style={{ 
                  left: `${(node.coords[0] / 135) * 100}%`, 
                  top: `${(node.coords[1] / 95) * 100}%` 
                }}
                onClick={() => handleSelectNode(key)}
              >
                <div className="pin-marker">
                  {isHomeNode ? "🏠" : (isActive ? "📍" : "⚪")}
                  <div className="pin-pulse"></div>
                </div>
                <span className="pin-label">{node.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Address Book & Selected Location Panel */}
        <div className="location-details-section glass-panel">
          
          {/* ADDRESS BOOK ACCORDION PANEL */}
          <div className="address-book-panel glass-panel">
            <h5 className="sub-title-details" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>📖 Bookmarked Addresses</span>
              <span className="badge-count">{pinnedLocations.length}</span>
            </h5>
            
            <div className="address-list">
              {pinnedLocations.map(pin => {
                const isPinHere = activeLocation === pin.settlementKey;
                
                // Calculate dynamic travel to bookmark target
                const pinTravel = calculateTravelStats(activeLocation, pin.settlementKey, properties.vehicles);
                
                return (
                  <div key={pin.id} className="address-item-card">
                    <div className="address-info">
                      <span className="address-name">{pin.icon} {pin.name}</span>
                      <span className="address-town">{pin.settlementKey}</span>
                    </div>

                    <div className="address-actions">
                      {isPinHere ? (
                        <button className="btn-mini btn-address-go" onClick={() => handleFastTravel(pin)}>
                          👁️ Open
                        </button>
                      ) : (
                        <button 
                          className="btn-mini btn-address-travel" 
                          onClick={() => handleFastTravel(pin)}
                          disabled={!pinTravel || gameState.needs.energy < pinTravel.energyCost}
                          title={pinTravel ? `Distance: ${pinTravel.distance.toFixed(1)} km, Time: ${pinTravel.ticks * 10}m` : 'Unreachable'}
                        >
                          ✈️ Go ({pinTravel ? `⚡${pinTravel.energyCost}` : 'N/A'})
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {pinnedLocations.length === 0 && (
                <p className="no-npcs-msg" style={{ margin: '0.25rem 0', fontSize: '0.72rem' }}>No bookmarked addresses yet. Pin locations using the star buttons!</p>
              )}
            </div>
          </div>

          {/* SELECTED LOCATION HEADER */}
          <div className="location-details-header" style={{ marginTop: '0.5rem' }}>
            <h4 className="text-gradient">{selectedSettlement.name}</h4>
            {activeLocation === selectedLocKey ? (
              <span className="here-badge-tag">📍 You Are Here</span>
            ) : (
              <span className="here-badge-tag inactive">Elsewhere</span>
            )}
          </div>

          <p className="location-desc-detail">{selectedSettlement.desc}</p>

          <div className="settlement-meta-grid">
            <div className="meta-card">
              <span className="meta-label">Type</span>
              <strong className="meta-value">{selectedSettlement.type}</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">Size</span>
              <strong className="meta-value">{selectedSettlement.popTier}</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">Accessibility</span>
              <strong className="meta-value" style={{ color: 'var(--neon-blue)' }}>
                {(metrics.accessibility_score * 100).toFixed(1)}%
              </strong>
            </div>
            <div className="meta-card" title="Sum of shortest path costs to power centres">
              <span className="meta-label">Isolation</span>
              <strong className="meta-value">{metrics.isolation_index.toFixed(1)}</strong>
            </div>
          </div>

          {/* TRAVEL DETAILS SECTION (if elsewhere) */}
          {activeLocation !== selectedLocKey && travelStats && (
            <div className="map-travel-action-box glass-panel">
              <h5 className="sub-title-details">Commute Logistics</h5>
              <div className="travel-diagnostic-list">
                <div className="diagnostic-item">
                  <span>Transport Vehicle:</span>
                  <strong>{travelStats.vehicleUsed}</strong>
                </div>
                <div className="diagnostic-item">
                  <span>Travel Distance:</span>
                  <strong>{travelStats.distance.toFixed(1)} km</strong>
                </div>
                <div className="diagnostic-item">
                  <span>Commute Time:</span>
                  <strong>{travelStats.ticks * 10} mins ({travelStats.ticks} ticks)</strong>
                </div>
                <div className="diagnostic-item">
                  <span>Energy Consumed:</span>
                  <strong style={{ color: 'var(--neon-purple)' }}>⚡ {travelStats.energyCost} Energy</strong>
                </div>
                {travelStats.fitnessBonus > 0 && (
                  <div className="diagnostic-item">
                    <span>Exercise Benefit:</span>
                    <strong style={{ color: '#10b981' }}>+{travelStats.fitnessBonus} Fitness</strong>
                  </div>
                )}
              </div>

              <div className="travel-path-itinerary">
                <span>Route: </span>
                <span className="path-route-string">{travelStats.path.join(" ➔ ")}</span>
              </div>

              <button
                className="btn-primary btn-travel-large"
                onClick={() => handleTravel(selectedLocKey)}
                disabled={gameState.needs.energy < travelStats.energyCost}
                style={{ marginTop: '1rem' }}
              >
                🚀 Travel to {selectedSettlement.name}
              </button>
            </div>
          )}

          {/* INTERACTIVE WORKSPACE (if here) */}
          {activeLocation === selectedLocKey && (
            <div className="location-interactive-area">
              <div className="venue-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`}
                  onClick={() => setActiveTab('info')}
                >
                  Info & Activity
                </button>

                {selectedSettlement.venues?.map(venue => {
                  let label = venue.charAt(0).toUpperCase() + venue.slice(1);
                  if (venue === 'university') label = "University";
                  if (venue === 'mall') label = "Avenue Mall";
                  if (venue === 'office') label = "OmniCorp HQ";
                  if (venue === 'club') label = "Nightclub";
                  
                  return (
                    <button 
                      key={venue}
                      className={`tab-btn ${activeTab === venue ? 'active' : ''}`}
                      onClick={() => setActiveTab(venue)}
                    >
                      {label}
                    </button>
                  );
                })}

                {(selectedSettlement.pubs?.length > 0 || selectedSettlement.cafes?.length > 0) && (
                  <button 
                    className={`tab-btn ${activeTab === 'dining' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('dining');
                      setSelectedDiningKey(null);
                    }}
                  >
                    🍺 Pubs & Cafes
                  </button>
                )}

                {isPlayerHomeHere && (
                  <button className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>My Flat</button>
                )}
              </div>

              {/* VENUE TAB CONTENTS */}
              <div className="tab-content-panel">
                
                {/* 1. GENERAL INFO & LOCAL ACTIVITIES */}
                {activeTab === 'info' && (
                  <div className="activities-tab-content">
                    <h6 className="interaction-title">Settlement Activity</h6>
                    
                    {/* Endleigh Mire Walk */}
                    {selectedLocKey === 'Endleigh' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Explore the Mire Paths</strong>
                          <p className="activity-desc">Wander the damp marshes. (+2 Creativity, +10 Mood, ⚡ -10)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Mire Paths')}
                            title="Bookmark this activity"
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('mire')} disabled={gameState.needs.energy < 10}>Explore</button>
                        </div>
                      </div>
                    )}

                    {/* Stillwater Mounds */}
                    {selectedLocKey === 'Stillwater-under-Barrow' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Explore the Ancient Mounds</strong>
                          <p className="activity-desc">Study runes. (+2 Intel, +1 Confidence, ⚡ -20)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Ancient Mounds')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('barrow')} disabled={gameState.needs.energy < 20}>Explore</button>
                        </div>
                      </div>
                    )}

                    {/* Eldersley activity */}
                    {selectedLocKey === 'Eldersley' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Hike the Grassy Rise</strong>
                          <p className="activity-desc">Climb high hills. (+1 Fitness, +1 Confidence, ⚡ -10)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Grassy Rise')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('hike')} disabled={gameState.needs.energy < 10}>Hike</button>
                        </div>
                      </div>
                    )}

                    {/* Durnthorne activity */}
                    {selectedLocKey === 'Durnthorne' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Forage in Old Growth Woods</strong>
                          <p className="activity-desc">Hunt wild plants. (+1 Intel, +1 Fitness, ⚡ -15)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Durnthorne Woods')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('forest')} disabled={gameState.needs.energy < 15}>Forage</button>
                        </div>
                      </div>
                    )}

                    {/* Fallowmere activity */}
                    {selectedLocKey === 'Fallowmere' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Meditate at Woodland Shrine</strong>
                          <p className="activity-desc">Gain peace. (+2 Empathy, +15 Mood, ⚡ -10)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Woodland Shrine')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('shrine')} disabled={gameState.needs.energy < 10}>Meditate</button>
                        </div>
                      </div>
                    )}

                    {/* Blackmere Heath activity */}
                    {selectedLocKey === 'Blackmere Heath' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Hike the Heath</strong>
                          <p className="activity-desc">Walk heather plains. (+1.5 Fitness, +10 Mood, ⚡ -10)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Blackmere Heath Hike')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('heath')} disabled={gameState.needs.energy < 10}>Hike</button>
                        </div>
                      </div>
                    )}

                    {/* Willow Fen activity */}
                    {selectedLocKey === 'Willow Fen' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Cut Reed in the Fens</strong>
                          <p className="activity-desc">Manual labor. (+$45 Cash, +0.5 Fitness, ⚡ -20)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Reed Cutting')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('reed')} disabled={gameState.needs.energy < 20}>Work</button>
                        </div>
                      </div>
                    )}

                    {/* Harrowfen activity */}
                    {selectedLocKey === 'Harrowfen' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Inspect the Drainage Works</strong>
                          <p className="activity-desc">Volunteer at the dykes. (+1 Intel, +1 Confidence, ⚡ -10)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Drainage Works')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('drainage')} disabled={gameState.needs.energy < 10}>Inspect</button>
                        </div>
                      </div>
                    )}

                    {/* Bramblewick activity */}
                    {selectedLocKey === 'Bramblewick' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Walk in Greenwood Park</strong>
                          <p className="activity-desc">Nature trails. (+1 Empathy, +10 Mood, ⚡ -5)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Greenwood Walk')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('park')} disabled={gameState.needs.energy < 5}>Walk</button>
                        </div>
                      </div>
                    )}

                    {/* Stagborough activity */}
                    {selectedLocKey === 'Stagborough' && (
                      <div className="activity-card-action">
                        <div>
                          <strong>Hunt in the Royal Chase</strong>
                          <p className="activity-desc">Hunt buck. (+1 Fit, +1 Conf, +20 Mood, ⚡ -25)</p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button 
                            className={`btn-pin-star ${isVenuePinned('info') ? 'pinned' : ''}`}
                            onClick={() => togglePinVenue('info', 'Royal Chase Hunt')}
                          >
                            {isVenuePinned('info') ? '★' : '☆'}
                          </button>
                          <button className="btn-mini btn-talk" onClick={() => handleLocalActivity('hunt')} disabled={gameState.needs.energy < 25}>Hunt</button>
                        </div>
                      </div>
                    )}

                    <div className="npc-list-location" style={{ marginTop: '1.25rem' }}>
                      <h6 className="interaction-title">Characters Active Here</h6>
                      {activeEncounters.map((encounter, idx) => {
                        const npc = NPCS.find(n => n.id === encounter.npcId);
                        if (!npc) return null;
                        const isMatched = matches[npc.id];
                        return (
                          <div key={`${npc.id}-${idx}`} className="location-npc-card">
                            <div className="npc-info-mini">
                              <span className="npc-name">{npc.name}</span>
                              <span className="npc-archetype-mini">{encounter.reveals ? `Reveals: ${encounter.reveals.replace(/_/g, ' ')}` : npc.description}</span>
                            </div>
                            <button className="btn-mini btn-talk" onClick={() => startOrganicEncounter({ ...encounter, location: activeTab === 'info' ? 'park' : activeTab })}>
                              Encounter
                            </button>
                            {isMatched && (
                              <button className="btn-mini btn-talk" onClick={() => onTalkNpc(npc.id)}>
                                Talk
                              </button>
                            )}
                          </div>
                        );
                      })}
                      {activeEncounters.length === 0 && (
                        <p className="no-npcs-msg" style={{ margin: '0.5rem 0' }}>No characters are currently active here at this time.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. UNIVERSITY TAB */}
                {activeTab === 'university' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>University of Brockleighshire</h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('university') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('university', 'University')}
                      >
                        {isVenuePinned('university') ? '★' : '☆'}
                      </button>
                    </div>
                    
                    <p>Enroll in structured degree programs to unlock high-tier gigs and careers.</p>
                    
                    {education.studentLoans > 0 && (
                      <div className="loan-warning-panel">
                        💸 Outstanding Student Loans: ${education.studentLoans} (5% weekly interest)
                      </div>
                    )}

                    {education.activeCourse ? (
                      <div className="active-course-panel">
                        <strong>Active Course: {courses[education.activeCourse].name}</strong>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${(education.courseProgress / courses[education.activeCourse].durationTicks) * 100}%`, background: 'var(--neon-blue)' }}></div>
                        </div>
                        <button className="btn-primary" onClick={studyCourse} disabled={gameState.needs.energy < 25}>
                          Study Session (⚡ 25)
                        </button>
                      </div>
                    ) : (
                      <div className="courses-grid">
                        {Object.values(courses).map(course => {
                          const canAfford = stats.money >= course.cost;
                          const hasEarned = stats.credentials?.includes(course.credentialEarned);
                          return (
                            <div key={course.id} className="course-card">
                              <div>
                                <strong style={{ color: hasEarned ? 'var(--neon-purple)' : 'white' }}>{course.name}</strong>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Cost: ${course.cost} | {course.durationTicks} ticks</div>
                              </div>
                              <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column' }}>
                                <button 
                                  className="btn-mini btn-buy" 
                                  onClick={() => enrollCourse(course.id)}
                                  disabled={!canAfford || hasEarned}
                                >
                                  {hasEarned ? 'Earned' : 'Cash'}
                                </button>
                                {!hasEarned && !canAfford && (
                                  <button 
                                    className="btn-mini btn-buy" 
                                    style={{ background: 'var(--neon-purple)' }}
                                    onClick={() => enrollCourseWithLoan(course.id)}
                                  >
                                    Loan
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. LIBRARIES TAB */}
                {activeTab === 'library' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>
                        {selectedLocKey === 'Brockleigh' ? 'Grand Library' : 
                         selectedLocKey === 'Stagborough' ? 'Stagborough Library' : 'Bramblewick Reading Room'}
                      </h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('library') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('library', selectedLocKey === 'Brockleigh' ? 'Grand Library' : 'Local Library')}
                      >
                        {isVenuePinned('library') ? '★' : '☆'}
                      </button>
                    </div>
                    <p>A quiet space to study your active courses and read local archives.</p>
                    
                    {education.activeCourse ? (
                      <div className="active-course-panel">
                        <strong>Active Course: {courses[education.activeCourse].name}</strong>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${(education.courseProgress / courses[education.activeCourse].durationTicks) * 100}%`, background: 'var(--neon-blue)' }}></div>
                        </div>
                        <button className="btn-primary" onClick={studyCourse} disabled={gameState.needs.energy < 25}>
                          Study Session (⚡ 25)
                        </button>
                      </div>
                    ) : (
                      <div className="activity-card-action" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.80rem', borderRadius: '6px' }}>
                        <div>
                          <strong>Self-Guided Study Session</strong>
                          <p className="activity-desc">Study and read books. (+1 Intelligence, ⚡ -15)</p>
                        </div>
                        <button className="btn-primary" onClick={() => performAction("Studied at local library", 6, { intelligence: 1 }, 15, 0)} disabled={gameState.needs.energy < 15}>
                          Study
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. OFFICE TAB */}
                {activeTab === 'office' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>OmniCorp Headquarters</h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('office') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('office', 'OmniCorp HQ')}
                      >
                        {isVenuePinned('office') ? '★' : '☆'}
                      </button>
                    </div>
                    {gameState.career.activeTrack ? (
                      <div className="office-work-panel glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                        <p>Track: <strong style={{ textTransform: 'capitalize' }}>{gameState.career.activeTrack}</strong></p>
                        <p>Title: <strong>Level {gameState.career.titleLevel}</strong></p>
                        <p>Promotion Points: <strong>{gameState.career.promotionPoints} / 100</strong></p>
                        
                        {gameState.career.currentProject ? (
                          <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                            <strong>Project: {gameState.career.currentProject}</strong>
                            <div className="progress-bar-container" style={{ margin: '0.4rem 0' }}>
                              <div className="progress-bar-fill" style={{ width: `${gameState.career.projectProgress}%`, background: 'var(--neon-blue)' }}></div>
                            </div>
                            <button className="btn-primary" onClick={() => workOnProject(15)} disabled={gameState.needs.energy < 15} style={{ width: '100%', marginTop: '0.5rem' }}>
                              Work on Project (⚡ 15)
                            </button>
                          </div>
                        ) : (
                          <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                            <p className="no-npcs-msg" style={{ margin: '0.5rem 0' }}>No active project. Assign one from your Phone's Career App.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Not employed. Enroll from Phone Career App.
                      </p>
                    )}
                  </div>
                )}

                {/* 5. MALL SHOPPING TAB */}
                {activeTab === 'mall' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>Avenue Shopping Mall</h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('mall') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('mall', 'Avenue Mall')}
                      >
                        {isVenuePinned('mall') ? '★' : '☆'}
                      </button>
                    </div>
                    <p>Purchase designer furniture, appliances, or vehicles:</p>
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
                                {discountPercent > 0 && <span style={{ fontSize: '0.7rem', color: '#10b981', marginLeft: '0.3rem' }}>(-{Math.round(discountPercent * 100)}%)</span>}
                              </span>
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

                {/* 6. GYM TAB */}
                {activeTab === 'gym' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>Peak Fitness Gym</h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('gym') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('gym', 'Peak Gym')}
                      >
                        {isVenuePinned('gym') ? '★' : '☆'}
                      </button>
                    </div>
                    <p>Work out to boost physical fitness.</p>
                    <div className="activity-card-action" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '6px' }}>
                      <div>
                        <strong>Gym Workout Session</strong>
                        <p className="activity-desc">Gain fitness. (+2 Fitness, ⚡ -15, -25 Hygiene)</p>
                      </div>
                      <button className="btn-primary" onClick={() => performAction("Worked out at Peak Fitness Gym", 6, { fitness: 2 }, 15, 0)} disabled={gameState.needs.energy < 15}>
                        Exercise
                      </button>
                    </div>
                  </div>
                )}

                {/* 7. CLUB TAB */}
                {activeTab === 'club' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>
                        {selectedLocKey === 'Brockleigh' ? 'Neon Beats Nightclub' : 'The Gilded Arch Lounge'}
                      </h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('club') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('club', selectedLocKey === 'Brockleigh' ? 'Neon Beats' : 'Gilded Club')}
                      >
                        {isVenuePinned('club') ? '★' : '☆'}
                      </button>
                    </div>
                    {selectedLocKey === 'Brockleigh' && (!properties.vehicles.includes('sports_car') && stats.style < 50) ? (
                      <div className="gated-lock-box">
                        <p className="lock-reason-title">🔒 CLUB ENTRY DENIED</p>
                        <p className="lock-reason-desc">Requires 50+ Style or owning a Sports Car to bypass the guest list.</p>
                      </div>
                    ) : (
                      <div className="activity-card-action" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.8rem', borderRadius: '6px' }}>
                        <div>
                          <strong>Hit the Dance Floor</strong>
                          <p className="activity-desc">Show off moves. (+1 Style, +15 Mood, ⚡ -15)</p>
                        </div>
                        <button className="btn-primary" onClick={() => performAction("Danced at club", 6, { style: 1, mood: 15 }, 15, 0)} disabled={gameState.needs.energy < 15}>
                          Dance
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 8. PARK TAB */}
                {activeTab === 'park' && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>Greenwood Park</h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('park') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('park', 'Greenwood Park')}
                      >
                        {isVenuePinned('park') ? '★' : '☆'}
                      </button>
                    </div>
                    <p>Walk around the quiet pond and scenic parkways.</p>
                    <div className="activity-card-action" style={{ background: 'rgba(0,0,0,0.1)', padding: '0.80rem', borderRadius: '6px' }}>
                      <div>
                        <strong>Scenic Nature Walk</strong>
                        <p className="activity-desc">Relax. (+1 Empathy, +10 Mood, ⚡ -5)</p>
                      </div>
                      <button className="btn-primary" onClick={() => handleLocalActivity('park')} disabled={gameState.needs.energy < 5}>
                        Walk
                      </button>
                    </div>
                  </div>
                )}

                {/* 9. DINING: PUBS & CAFES */}
                {activeTab === 'dining' && (
                  <div className="dining-tab-content">
                    {selectedDiningKey === null ? (
                      <div>
                        {selectedSettlement.pubs?.length > 0 && (
                          <div style={{ marginBottom: '1rem' }}>
                            <h6 className="interaction-title">Local Pubs</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {selectedSettlement.pubs.map(pub => (
                                <div key={pub} style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                                  <button 
                                    className="dining-select-btn"
                                    onClick={() => setSelectedDiningKey({ type: 'pub', name: pub })}
                                    style={{ flex: 1 }}
                                  >
                                    🍺 {pub}
                                  </button>
                                  <button 
                                    className={`btn-pin-star ${isVenuePinned('dining', { type: 'pub', name: pub }) ? 'pinned' : ''}`}
                                    onClick={() => togglePinVenue('dining', pub, { type: 'pub', name: pub })}
                                    style={{ width: '40px', padding: 0 }}
                                  >
                                    {isVenuePinned('dining', { type: 'pub', name: pub }) ? '★' : '☆'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {selectedSettlement.cafes?.length > 0 && (
                          <div>
                            <h6 className="interaction-title">Local Cafes</h6>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {selectedSettlement.cafes.map(cafe => (
                                <div key={cafe} style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                                  <button 
                                    className="dining-select-btn"
                                    onClick={() => setSelectedDiningKey({ type: 'cafe', name: cafe })}
                                    style={{ flex: 1 }}
                                  >
                                    ☕ {cafe}
                                  </button>
                                  <button 
                                    className={`btn-pin-star ${isVenuePinned('dining', { type: 'cafe', name: cafe }) ? 'pinned' : ''}`}
                                    onClick={() => togglePinVenue('dining', cafe, { type: 'cafe', name: cafe })}
                                    style={{ width: '40px', padding: 0 }}
                                  >
                                    {isVenuePinned('dining', { type: 'cafe', name: cafe }) ? '★' : '☆'}
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="dining-detail-card glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                          <strong style={{ fontSize: '0.9rem', color: 'var(--neon-purple)' }}>
                            {selectedDiningKey.type === 'pub' ? '🍺' : '☕'} {selectedDiningKey.name}
                          </strong>
                          <button className="btn-mini" onClick={() => setSelectedDiningKey(null)}>Back</button>
                        </div>
                        
                        {selectedDiningKey.type === 'pub' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="activity-card-action" style={{ margin: 0 }}>
                              <div>
                                <strong>Drink a Pint</strong>
                                <p className="activity-desc">Ale. (-$8, ⚡ +20, +15 Mood)</p>
                              </div>
                              <button className="btn-mini btn-talk" onClick={() => handlePubAction(selectedDiningKey.name, 'drink')} disabled={stats.money < 8}>Drink</button>
                            </div>
                            <div className="activity-card-action" style={{ margin: 0 }}>
                              <div>
                                <strong>Chat with Locals</strong>
                                <p className="activity-desc">Socialize. (+1 Social IQ, +1 Conf, ⚡ -10)</p>
                              </div>
                              <button className="btn-mini btn-talk" onClick={() => handlePubAction(selectedDiningKey.name, 'chat')} disabled={gameState.needs.energy < 10}>Chat</button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="activity-card-action" style={{ margin: 0 }}>
                              <div>
                                <strong>Coffee & Pastry</strong>
                                <p className="activity-desc">Warm brew. (-$6, ⚡ +15, +10 Mood)</p>
                              </div>
                              <button className="btn-mini btn-talk" onClick={() => handleCafeAction(selectedDiningKey.name, 'coffee')} disabled={stats.money < 6}>Buy</button>
                            </div>
                            <div className="activity-card-action" style={{ margin: 0 }}>
                              <div>
                                <strong>Laptop Study Session</strong>
                                <p className="activity-desc">Work remotely. (+1 Intel, +0.5 Prog, +0.5 Creat, ⚡ -10)</p>
                              </div>
                              <button className="btn-mini btn-talk" onClick={() => handleCafeAction(selectedDiningKey.name, 'study')} disabled={gameState.needs.energy < 10}>Study</button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 10. HOME FLAT TAB */}
                {activeTab === 'home' && isPlayerHomeHere && (
                  <div className="loc-interactive-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h6 style={{ color: 'var(--neon-blue)', margin: 0 }}>My Flat</h6>
                      <button 
                        className={`btn-pin-star ${isVenuePinned('home') ? 'pinned' : ''}`}
                        onClick={() => togglePinVenue('home', 'My Flat')}
                      >
                        {isVenuePinned('home') ? '★' : '☆'}
                      </button>
                    </div>
                    <p>You are at your flat. Rest up, prepare meals, or organize storage.</p>
                    <div className="home-assets-preview">
                      <h6>Residence Specs</h6>
                      <div className="preview-grid">
                        <span>Flat Type: {HOUSING_TIERS[stats.housingTier]?.name}</span>
                        <span>Rent Rate: ${HOUSING_TIERS[stats.housingTier]?.rent}/week</span>
                        <span>Slots: {placedFurniture.length} / {HOUSING_TIERS[stats.housingTier]?.slots} Used</span>
                      </div>
                    </div>
                    <p style={{ marginTop: '0.75rem', fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Note: You can Sleep, Cook, and Customize this flat from the quick-action dock on the Dashboard.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapUI;
