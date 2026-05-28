import { useState } from 'react';
import { useGameStore } from '../state/store';
import { LOCATIONS } from '../data/locations';
import { DATE_TEMPLATES, NPC_DATE_PREFERENCES } from '../data/dates';
import { NPCS } from '../data/npcs';
import './DialogueUI.css';

const DialogueUI = ({ npcId, onClose }) => {
  const { 
    gameState, 
    answerDialogue, 
    goOnDate, 
    resolveStoryEvent,
    proposeMarriage,
    askToMoveIn,
    swipeNpc
  } = useGameStore();

  const { matches, relationshipMemory, stats } = gameState;
  const npc = NPCS.find(n => n.id === npcId);
  const matchedData = matches[npcId];

  const getGreeting = () => {
    if (!matchedData) return npc.dialogue.intro;
    if (gameState.family.spouseId === npcId) {
      return gameState.family.married 
        ? `Hey honey! It's so good to see you. How was your day?` 
        : `Hey sweetheart! I'm so excited for our wedding. What's on your mind?`;
    }
    const memory = gameState.relationshipMemory?.[npcId];
    const shared = memory?.sharedActivities;
    const lastActivity = shared?.[shared.length - 1];
    if (lastActivity) {
      return `I was thinking about ${lastActivity.replace('date_', 'our ')}. I like that you remember what matters to us.`;
    }
    const rel = matchedData.relationship;
    if (rel >= 80) return `Hey love! I was just thinking about you. What should we do today?`;
    if (rel >= 50) return `Hey! I've been looking forward to seeing you. What's up?`;
    if (rel >= 20) return `Oh, hey! Great to see you again. What's on your mind?`;
    return `Oh, hello. Did you need something?`;
  };

  const [dialogueText, setDialogueText] = useState(getGreeting());
  const [showChoices, setShowChoices] = useState(!matchedData);
  const [dateMode, setDateMode] = useState(false);
  const [storyMode, setStoryMode] = useState(false);

  if (!npc) return null;

  const currentTier = matchedData?.storyTier || 0;
  const nextCap = (currentTier + 1) * 25;
  const isCapped = matchedData && matchedData.relationship >= nextCap && nextCap <= 100;
  const activeStoryEvent = isCapped ? npc.storyEvents[nextCap] : null;

  const handleChoice = (choiceIndex) => {
    const success = answerDialogue(npcId, choiceIndex);
    const choice = npc.dialogue.choices[choiceIndex];
    
    if (!matchedData) {
      if (success) {
        setDialogueText(choice.successText + " (Matched!)");
        swipeNpc(npcId, 'right');
      } else {
        setDialogueText(choice.failText + " (Didn't Match)");
      }
      setShowChoices(false);
    }
  };

  const handleStoryEvent = () => {
    const success = stats[activeStoryEvent.statCheck] >= activeStoryEvent.threshold;
    resolveStoryEvent(npcId, success);
    if (success) {
      setDialogueText(`[SUCCESS] ${activeStoryEvent.successText}`);
    } else {
      setDialogueText(`[FAILED] ${activeStoryEvent.failText} (Requires ${activeStoryEvent.statCheck} >= ${activeStoryEvent.threshold})`);
    }
    setStoryMode(false);
  };

  const handleDate = (dateType) => {
    const template = DATE_TEMPLATES[dateType];
    const locKey = template.venueKey;
    const success = goOnDate(npcId, locKey, dateType);
    if (success) {
      const comment = npc.dialogue.dateLines?.[locKey] || "I enjoyed going out with you.";
      setDialogueText(`[${template.title} at ${LOCATIONS[locKey].name}] "${comment}"`);
    } else {
      setDialogueText(`Could not go on date. Check your energy.`);
    }
    setDateMode(false);
  };

  const handlePropose = () => {
    const success = proposeMarriage(npcId);
    if (success) {
      setDialogueText(`💍 Oh my gosh... YES! I will marry you! (Marriage accepted!)`);
    } else {
      setDialogueText(`They look surprised. 'I don't think we're ready for that yet, or maybe your place is too small...'`);
    }
  };

  const handleAskToMoveIn = () => {
    if (gameState.stats.housingTier < 1) {
      setDialogueText(`I'd love to, but your place is way too small. (Requires Housing Tier 2+)`);
      return;
    }
    askToMoveIn(npcId);
    setDialogueText(`I would love to move in with you! Let's do this.`);
  };

  const npcMemory = relationshipMemory?.[npcId];
  const memoryCount = (npcMemory?.rememberedChoices?.length || 0)
    + (npcMemory?.sharedActivities?.length || 0)
    + (npcMemory?.importantMoments?.length || 0)
    + Object.keys(npcMemory?.promises || {}).length
    + (npcMemory?.comfortKnown?.length || 0);

  const getRelationshipTier = (relationship) => {
    if (gameState.family.spouseId === npcId) {
      return gameState.family.married ? 'Spouse 💍' : 'Fiancé 💍';
    }
    if (relationship >= 80) return 'Partner ❤️';
    if (relationship >= 50) return 'Dating 💕';
    if (relationship >= 20) return 'Crush 💖';
    return 'Stranger';
  };

  return (
    <div className="glass-panel dialogue-container animate-fade-in">
      <header className="dialogue-header">
        <div className="npc-title-area">
          <div className="dialogue-avatar">{npc.name.charAt(0)}</div>
          <div>
            <h4>{npc.name}</h4>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>
              Status: {matchedData ? getRelationshipTier(matchedData.relationship) : 'Stranger'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '200px' }}>
          <div className="relationship-meter">
            <span>Rel: {matchedData ? `${matchedData.relationship}/${nextCap <= 100 ? nextCap : 100}` : 'Not Met'}</span>
            <div className="rel-bar-bg">
              <div 
                className="rel-bar-fill" 
                style={{ width: `${matchedData ? matchedData.relationship : 0}%` }}
              ></div>
            </div>
          </div>

          {matchedData && (
            <div className="relationship-meter">
              <span>Chem: {matchedData.chemistry || 10}/100</span>
              <div className="rel-bar-bg">
                <div 
                  className="rel-bar-fill" 
                  style={{ 
                    width: `${matchedData.chemistry || 10}%`,
                    backgroundColor: 'var(--accent-pink)',
                    boxShadow: '0 0 8px rgba(236, 72, 153, 0.4)'
                  }}
                ></div>
              </div>
            </div>
          )}

          {matchedData && (
            <div className="relationship-meter">
              <span>Memory: {memoryCount} meaningful moments</span>
            </div>
          )}
        </div>
      </header>

      <div className="dialogue-body glass-panel">
        <p className="dialogue-speaker">{npc.name}</p>
        <p className="dialogue-text">"{dialogueText}"</p>
      </div>

      <div className="dialogue-controls">
        {showChoices && !matchedData && (
          <div className="choices-list">
            {npc.dialogue.choices.map((choice, idx) => (
               <button key={idx} className="btn-primary choice-btn" onClick={() => handleChoice(idx)}>
                 {choice.text}
               </button>
            ))}
          </div>
        )}

        {storyMode && activeStoryEvent && (
          <div className="selection-overlay">
            <h5>Story Event: {npc.name}'s Milestone</h5>
            <p style={{ margin: '10px 0' }}>{activeStoryEvent.prompt}</p>
            <button className="btn-primary" onClick={handleStoryEvent} style={{ marginBottom: '10px' }}>
              Attempt Event (Uses {activeStoryEvent.statCheck})
            </button>
            <button className="btn-secondary" onClick={() => setStoryMode(false)}>Not right now</button>
          </div>
        )}

        {!showChoices && !dateMode && !storyMode && (
          <div className="dialogue-action-bar">
            {matchedData ? (
              <>
                {isCapped && activeStoryEvent ? (
                  <button className="btn-primary" style={{ backgroundColor: '#f39c12' }} onClick={() => setStoryMode(true)}>
                    ⭐ Play Story Event (Break Cap)
                  </button>
                ) : (
                  <>
                    <button className="btn-primary" onClick={() => setDialogueText("Let's talk about our hobbies... " + npc.description)}>
                      💬 Chat
                    </button>
                    <button className="btn-primary" onClick={() => setDateMode(true)}>
                      🥂 Ask on Date
                    </button>
                  </>
                )}
                {matchedData.relationship >= 75 && currentTier >= 3 && !gameState.family.spouseId && gameState.living.roommateId !== npcId && (
                  <button className="btn-primary" style={{ backgroundColor: '#9b59b6' }} onClick={handleAskToMoveIn}>
                    🏠 Ask to Move In
                  </button>
                )}
                {matchedData.relationship >= 75 && currentTier >= 3 && !gameState.family.spouseId && (
                  <button className="btn-primary marriage-btn" onClick={handlePropose}>
                    💍 Propose
                  </button>
                )}
              </>
            ) : (
              <button className="btn-primary" onClick={onClose}>End Conversation</button>
            )}
            {matchedData && <button className="btn-secondary" onClick={onClose}>Goodbye</button>}
          </div>
        )}

        {dateMode && (
          <div className="selection-overlay">
            <h5>Select Date Type</h5>
            <p style={{ margin: '8px 0', color: 'var(--text-secondary)' }}>
              Preferred dates are based on personality and memories, not repeatable gifts.
            </p>
            <div className="selection-grid">
              {(NPC_DATE_PREFERENCES[npcId] || ['coffee_date', 'park_walk']).map((dateType) => {
                const template = DATE_TEMPLATES[dateType];
                const loc = LOCATIONS[template.venueKey];
                const isGated = loc.gated && !gameState.properties.vehicles.includes('sports_car') && stats.style < loc.reqStyle;
                return (
                  <button key={dateType} className="btn-mini btn-select-item" onClick={() => handleDate(dateType)} disabled={isGated}>
                    {template.title} — {loc.name} {isGated && "🔒"}
                  </button>
                );
              })}
            </div>
            <button className="btn-mini btn-cancel" onClick={() => setDateMode(false)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DialogueUI;
