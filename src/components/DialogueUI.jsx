import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { LOCATIONS } from '../data/locations';
import { NPCS } from '../data/npcs';
import { ITEMS } from '../state/ItemDatabase';
import './DialogueUI.css';

const DialogueUI = ({ npcId, onClose }) => {
  const { 
    gameState, 
    answerDialogue, 
    giveGift, 
    goOnDate, 
    proposeMarriage,
    swipeNpc
  } = useGame();

  const { matches, inventory, stats } = gameState;
  const npc = NPCS.find(n => n.id === npcId);
  const matchedData = matches[npcId];

  const [dialogueText, setDialogueText] = useState(
    matchedData ? `Hey! Great to see you again. What's on your mind?` : npc.dialogue.intro
  );
  const [showChoices, setShowChoices] = useState(!matchedData);
  const [giftMode, setGiftMode] = useState(false);
  const [dateMode, setDateMode] = useState(false);

  if (!npc) return null;

  const handleChoice = (choiceIndex) => {
    const success = answerDialogue(npcId, choiceIndex);
    const choice = npc.dialogue.choices[choiceIndex];
    
    if (!matchedData) {
      // Intro matching choice
      if (success) {
        setDialogueText(choice.successText + " (Matched!)");
        // We need to auto swipe match if they pass the intro!
        swipeNpc(npcId, 'right');
      } else {
        setDialogueText(choice.failText + " (Didn't Match)");
      }
      setShowChoices(false);
    }
  };

  const handleGift = (itemKey) => {
    giveGift(npcId, itemKey);
    setDialogueText(`Thanks for the ${ITEMS[itemKey].name}! You know me so well.`);
    setGiftMode(false);
  };

  const handleDate = (locKey) => {
    const success = goOnDate(npcId, locKey);
    if (success) {
      const comment = npc.dialogue.dateLines[locKey] || "I enjoyed going out with you.";
      setDialogueText(`[Date at ${LOCATIONS[locKey].name}] "${comment}"`);
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

  // Filter inventory for gift items only
  const availableGifts = Object.entries(inventory).filter(([key, qty]) => {
    return qty > 0 && ITEMS[key] && ITEMS[key].type === 'gift';
  });

  return (
    <div className="glass-panel dialogue-container animate-fade-in">
      {/* Header */}
      <header className="dialogue-header">
        <div className="npc-title-area">
          <div className="dialogue-avatar">{npc.name.charAt(0)}</div>
          <div>
            <h4>{npc.name}</h4>
            <span style={{ fontSize: '0.80rem', color: 'var(--text-secondary)' }}>Status: {matchedData ? 'Connected' : 'Stranger'}</span>
          </div>
        </div>
        <div className="relationship-meter">
          <span>Rel: {matchedData ? `${matchedData.relationship}/100` : 'Not Met'}</span>
          <div className="rel-bar-bg">
            <div 
              className="rel-bar-fill" 
              style={{ width: `${matchedData ? matchedData.relationship : 0}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Dialogue Box */}
      <div className="dialogue-body glass-panel">
        <p className="dialogue-speaker">{npc.name}</p>
        <p className="dialogue-text">"{dialogueText}"</p>
      </div>

      {/* Inputs / Choices / Controls */}
      <div className="dialogue-controls">
        {/* Intro choices */}
        {showChoices && !matchedData && (
          <div className="choices-list">
            {npc.dialogue.choices.map((choice, idx) => (
              <button 
                key={idx} 
                className="btn-primary choice-btn"
                onClick={() => handleChoice(idx)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Post-intro general controls */}
        {!showChoices && !giftMode && !dateMode && (
          <div className="dialogue-action-bar">
            {matchedData ? (
              <>
                <button className="btn-primary" onClick={() => setDialogueText("Let's talk about our hobbies... " + npc.description)}>
                  💬 Chat
                </button>
                <button className="btn-primary" onClick={() => setGiftMode(true)}>
                  🎁 Give Gift
                </button>
                <button className="btn-primary" onClick={() => setDateMode(true)}>
                  🥂 Ask on Date
                </button>
                {matchedData.relationship >= 80 && (
                  <button className="btn-primary marriage-btn" onClick={handlePropose}>
                    💍 Propose
                  </button>
                )}
              </>
            ) : (
              <button className="btn-primary" onClick={onClose}>
                End Conversation
              </button>
            )}
            {matchedData && (
              <button className="btn-secondary" onClick={onClose}>
                Goodbye
              </button>
            )}
          </div>
        )}

        {/* Gift Selection Panel */}
        {giftMode && (
          <div className="selection-overlay">
            <h5>Select a Gift</h5>
            <div className="selection-grid">
              {availableGifts.map(([key, qty]) => (
                <button 
                  key={key} 
                  className="btn-mini btn-select-item"
                  onClick={() => handleGift(key)}
                >
                  {ITEMS[key].name} ({qty})
                </button>
              ))}
              {availableGifts.length === 0 && (
                <p className="error-text">No gifts in inventory. Buy some at the Mall.</p>
              )}
            </div>
            <button className="btn-mini btn-cancel" onClick={() => setGiftMode(false)}>Cancel</button>
          </div>
        )}

        {/* Date Selection Panel */}
        {dateMode && (
          <div className="selection-overlay">
            <h5>Select Date Location</h5>
            <div className="selection-grid">
              {Object.entries(LOCATIONS).map(([key, loc]) => {
                if (key === 'home' || key === 'mall') return null;
                const isGated = loc.gated && !gameState.properties.vehicles.includes('sports_car') && stats.style < loc.reqStyle;
                return (
                  <button 
                    key={key} 
                    className="btn-mini btn-select-item"
                    onClick={() => handleDate(key)}
                    disabled={isGated}
                  >
                    {loc.name} {isGated && "🔒"}
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
