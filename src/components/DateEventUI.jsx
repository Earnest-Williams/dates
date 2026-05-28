import { useState } from 'react';
import { useGameStore } from '../state/store';
import { NPCS } from '../data/npcs';
import { LOCATIONS } from '../data/locations';
import { getDateTemplate } from '../data/dates';
import './DateEventUI.css';

const clamp = (value) => Math.max(0, Math.min(100, value));

const DateEventUI = () => {
  const { gameState, resolveDateEvent } = useGameStore();
  const { activeDateEvent, stats } = gameState;
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [connectionScore, setConnectionScore] = useState(
    activeDateEvent?.connectionScore || 30
  );
  const [outcome, setOutcome] = useState({
    relationship: 0,
    chemistry: 0,
    mood: 0,
    energy: 0,
    discoveries: [],
    memories: [],
    callbacks: [],
    conflict: null,
    repairScene: null,
  });

  if (!activeDateEvent) return null;

  const npc = NPCS.find((item) => item.id === activeDateEvent.npcId);
  const template = getDateTemplate(activeDateEvent.dateType, activeDateEvent.locationKey);
  const location = LOCATIONS[template.venueKey] || LOCATIONS[activeDateEvent.locationKey];
  const currentPhase = template.phases[currentPhaseIndex];

  if (!npc || !currentPhase) return null;

  const appendUnique = (items, value) => {
    if (!value || items.includes(value)) return items;
    return [...items, value];
  };

  const mergeChoiceOutcome = (choice, checkResult) => {
    const statEffects = checkResult || {};
    const nextDiscoveries = appendUnique(
      outcome.discoveries,
      statEffects.discovery || choice.discovery
    );
    const nextMemories = appendUnique(outcome.memories, choice.memory);
    const nextCallbacks = appendUnique(outcome.callbacks, choice.callback);
    return {
      relationship: outcome.relationship + (choice.relationship || 0) + (statEffects.relationship || 0),
      chemistry: outcome.chemistry + (choice.chemistry || 0) + (statEffects.chemistry || 0),
      mood: outcome.mood + (choice.mood || 0) + (statEffects.mood || 0),
      energy: outcome.energy + (choice.energy || 0) + (statEffects.energy || 0),
      discoveries: nextDiscoveries,
      memories: nextMemories,
      callbacks: nextCallbacks,
      conflict: choice.conflict || outcome.conflict,
      repairScene: choice.repairScene || outcome.repairScene,
    };
  };

  const handleOptionClick = (option) => {
    let connectionChange = option.connection || 0;
    let checkResult = null;

    if (option.preferredArchetypes?.includes(npc.archetype)) {
      connectionChange += 8;
    } else if (option.dislikedArchetypes?.includes(npc.archetype)) {
      connectionChange -= 8;
    }

    if (option.checkStat) {
      const success = (stats[option.checkStat] || 0) >= option.threshold;
      checkResult = success ? option.success : option.fail;
      connectionChange += checkResult?.connection || 0;
    }

    const nextConnectionScore = clamp(connectionScore + connectionChange);
    const nextOutcome = mergeChoiceOutcome(option, checkResult);
    setConnectionScore(nextConnectionScore);
    setOutcome(nextOutcome);

    if (currentPhaseIndex < template.phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1);
      return;
    }

    let logText = 'The date was mixed, but you learned something real.';
    if (nextConnectionScore >= 80) logText = 'The date became a memorable shared scene.';
    else if (nextConnectionScore >= 50) logText = 'The date felt warm and specific.';
    else if (nextConnectionScore < 30) logText = 'The date went badly, but repair is possible.';

    resolveDateEvent(nextConnectionScore, logText, nextOutcome);
  };

  const getConnectionColor = () => {
    if (connectionScore >= 80) return '#2ecc71';
    if (connectionScore >= 50) return '#f1c40f';
    return '#e74c3c';
  };

  return (
    <div className="glass-panel date-event-container animate-fade-in" style={{ padding: '20px', color: 'white', maxWidth: '640px', margin: '0 auto' }}>
      <header className="date-header text-center">
        <h2>{template.title} with {npc.name}</h2>
        <p>Location: {location.name}</p>
        {(template.opportunity || template.complication) && (
          <p style={{ opacity: 0.85 }}>{template.opportunity || template.complication}</p>
        )}
      </header>

      <div className="vibe-meter-container glass-panel" style={{ margin: '20px 0', padding: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', display: 'flex', justifyContent: 'space-between' }}>
          <span>Connection</span>
          <span style={{ color: getConnectionColor() }}>{connectionScore}/100</span>
        </h4>
        <div className="vibe-bar-bg" style={{ width: '100%', height: '20px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            className="vibe-bar-fill"
            style={{
              width: `${connectionScore}%`,
              height: '100%',
              backgroundColor: getConnectionColor(),
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }}
          ></div>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.75, marginTop: '10px' }}>
          This is an internal read on date quality, not a gift or score optimization path.
        </p>
      </div>

      <div className="date-phase-section">
        <h3 className="text-gradient text-center" style={{ marginBottom: '15px' }}>{currentPhase.title}</h3>
        {currentPhase.prompt && <p style={{ marginBottom: '15px', textAlign: 'center', fontSize: '1.1rem' }}>{currentPhase.prompt}</p>}

        <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {currentPhase.choices.map((option) => (
            <button
              key={option.text}
              className="btn-primary"
              style={{
                padding: '15px',
                textAlign: 'left',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                border: '1px solid rgba(52, 152, 219, 0.5)',
                cursor: 'pointer',
              }}
              onClick={() => handleOptionClick(option)}
            >
              <div style={{ fontWeight: 'bold' }}>{option.text}</div>
              {option.checkStat && (
                <div style={{ fontSize: '0.85em', color: '#9b59b6', marginTop: '5px' }}>
                  Uses: {option.checkStat} {'>='} {option.threshold}
                </div>
              )}
              {option.discovery && (
                <div style={{ fontSize: '0.85em', color: '#7bed9f', marginTop: '5px' }}>
                  May reveal character information
                </div>
              )}
              {option.repairScene && (
                <div style={{ fontSize: '0.85em', color: '#ffb86c', marginTop: '5px' }}>
                  Risk: could require a later repair
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DateEventUI;
