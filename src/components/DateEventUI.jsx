import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { NPCS } from '../data/npcs';
import { LOCATIONS } from '../data/locations';
import { DATE_VIBES } from '../data/dateVibes';
import { DATE_EVENTS } from '../data/dates';
import './DateEventUI.css';

const DateEventUI = () => {
  const { gameState, resolveDateEvent } = useGameStore();
  const { activeDateEvent, stats } = gameState;
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [vibe, setVibe] = useState(30);

  if (!activeDateEvent) return null;

  const npc = NPCS.find(n => n.id === activeDateEvent.npcId);
  const location = LOCATIONS[activeDateEvent.locationKey];
  
  // Combine location-specific event with generic DATE_VIBES
  const locationEvents = DATE_EVENTS[activeDateEvent.locationKey] || [];
  
  // Use a stable event based on the date length or day so it doesn't change every render, or just pick the first one
  const specificEvent = locationEvents.length > 0 ? locationEvents[gameState.time.day % locationEvents.length] : null;

  const phases = [];
  if (specificEvent) {
    // Convert DATE_EVENTS format to DATE_VIBES format
    phases.push({
      id: 'location_event',
      title: 'Location Event',
      prompt: specificEvent.prompt,
      options: specificEvent.choices.map(c => ({
        text: c.text,
        checkStat: c.checkStat,
        threshold: c.threshold,
        successVibe: c.successRelation,
        failVibe: c.failRelation,
        preferredArchetypes: [],
        dislikedArchetypes: []
      }))
    });
  }
  
  phases.push(...DATE_VIBES.phases);

  const currentPhase = phases[currentPhaseIndex];

  const handleOptionClick = (option) => {
    let vibeChange = option.vibeChange || 0;

    // Phase 1 / 3 logic (archetype synergy)
    if (option.preferredArchetypes && option.preferredArchetypes.includes(npc.archetype)) {
      vibeChange += 15;
    } else if (option.dislikedArchetypes && option.dislikedArchetypes.includes(npc.archetype)) {
      vibeChange -= 20;
    }

    // Phase 2 logic (stat check)
    if (option.checkStat) {
      const success = stats[option.checkStat] >= option.threshold;
      vibeChange += success ? option.successVibe : option.failVibe;
    }

    const nextVibe = Math.max(0, Math.min(100, vibe + vibeChange));
    setVibe(nextVibe);

    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
    } else {
      // End of date
      let logText = "The date was just okay.";
      if (nextVibe >= 80) logText = "An absolutely perfect date!";
      else if (nextVibe >= 50) logText = "A pretty good time overall.";
      else if (nextVibe < 30) logText = "It was incredibly awkward and ruined the mood.";
      
      resolveDateEvent(nextVibe, logText);
    }
  };

  const getVibeColor = () => {
    if (vibe >= 80) return '#2ecc71';
    if (vibe >= 50) return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <div className="glass-panel date-event-container animate-fade-in" style={{ padding: '20px', color: 'white', maxWidth: '600px', margin: '0 auto' }}>
      <header className="date-header text-center">
        <h2>Date with {npc.name}</h2>
        <p>Location: {location.name}</p>
      </header>

      <div className="vibe-meter-container glass-panel" style={{ margin: '20px 0', padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <span>Current Vibe</span>
          <span style={{ color: getVibeColor() }}>{vibe}/100</span>
        </h4>
        <div className="vibe-bar-bg" style={{ width: '100%', height: '20px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '10px', overflow: 'hidden' }}>
          <div 
            className="vibe-bar-fill" 
            style={{ 
              width: `${vibe}%`, 
              height: '100%', 
              backgroundColor: getVibeColor(),
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }}
          ></div>
        </div>
      </div>

      <div className="date-phase-section">
        <h3 className="text-gradient text-center" style={{ marginBottom: '15px' }}>{currentPhase.title}</h3>
        {currentPhase.prompt && <p style={{ marginBottom: '15px', textAlign: 'center', fontSize: '1.1rem' }}>{currentPhase.prompt}</p>}
        
        <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentPhase.options.map((option, idx) => {
            const isAffordable = !option.cost || gameState.stats.money >= option.cost;
            return (
              <button 
                key={idx}
                className="btn-primary"
                style={{ 
                  padding: '15px', 
                  textAlign: 'left', 
                  backgroundColor: isAffordable ? 'rgba(52, 152, 219, 0.2)' : 'rgba(149, 165, 166, 0.2)',
                  border: isAffordable ? '1px solid rgba(52, 152, 219, 0.5)' : '1px solid rgba(149, 165, 166, 0.5)',
                  cursor: isAffordable ? 'pointer' : 'not-allowed',
                  opacity: isAffordable ? 1 : 0.5
                }}
                disabled={!isAffordable}
                onClick={() => handleOptionClick(option)}
              >
                <div style={{ fontWeight: 'bold' }}>{option.text}</div>
                {option.cost && <div style={{ fontSize: '0.85em', color: '#f39c12', marginTop: '5px' }}>Cost: ${option.cost}</div>}
                {option.checkStat && <div style={{ fontSize: '0.85em', color: '#9b59b6', marginTop: '5px' }}>Requires: {option.checkStat} {'>='} {option.threshold}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DateEventUI;
