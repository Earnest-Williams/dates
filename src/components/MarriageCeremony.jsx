import { useState } from 'react';
import { useGame } from '../state/GameContext';
import './MarriageCeremony.css';

const SUGGESTIONS = ['Jordan', 'Taylor', 'Alex', 'Morgan', 'Casey', 'Robin', 'Riley', 'Jamie'];

const MarriageCeremony = () => {
  const { gameState, completeWedding } = useGame();
  const { money } = gameState.stats;
  const spouseName = gameState.family.spouseName || 'your partner';

  const [selectedStyle, setSelectedStyle] = useState(null); // 'office', 'traditional', 'lavish'
  const [childName, setChildName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStartShift = () => {
    if (!selectedStyle) {
      setErrorMessage('Please select a wedding style.');
      return;
    }
    if (!childName.trim()) {
      setErrorMessage('Please enter a name for your child.');
      return;
    }

    let cost = 200;
    if (selectedStyle === 'traditional') cost = 1000;
    if (selectedStyle === 'lavish') cost = 4000;

    if (money < cost && selectedStyle !== 'office') {
      setErrorMessage("You don't have enough money for this style! Choose a simpler option.");
      return;
    }

    completeWedding(selectedStyle, childName.trim());
  };

  const handleSuggestionClick = (name) => {
    setChildName(name);
    setErrorMessage('');
  };

  return (
    <div className="glass-panel marriage-container animate-fade-in">
      <div className="marriage-card glass-panel">
        <header className="marriage-header">
          <span className="celebration-icon">💍</span>
          <h1 className="text-gradient">The Wedding of a Lifetime</h1>
          <p className="marriage-subtitle">
            Congratulations! You and <strong>{spouseName}</strong> are tying the knot. 
            Choose your wedding style and prepare for the next generation!
          </p>
        </header>

        {/* Wedding Package Selection Grid */}
        <section className="wedding-packages-section">
          <h2>Select a Wedding Style</h2>
          <div className="packages-grid">
            {/* Registry Office */}
            <div 
              className={`package-card glass-panel ${selectedStyle === 'office' ? 'active' : ''}`}
              onClick={() => { setSelectedStyle('office'); setErrorMessage(''); }}
            >
              <div className="package-icon">🏛️</div>
              <h3>Registry Office</h3>
              <p className="package-cost">${Math.min(200, money)}</p>
              <p className="package-desc">Simple, quick, and intimate. Let's make it official without the fuss.</p>
              <span className="package-benefit">Basic starting mood</span>
            </div>

            {/* Traditional */}
            <div 
              className={`package-card glass-panel ${selectedStyle === 'traditional' ? 'active' : ''} ${money < 1000 ? 'disabled' : ''}`}
              onClick={() => {
                if (money >= 1000) {
                  setSelectedStyle('traditional');
                  setErrorMessage('');
                } else {
                  setErrorMessage("Not enough money for a Traditional Wedding!");
                }
              }}
            >
              <div className="package-icon">⛪</div>
              <h3>Traditional Wedding</h3>
              <p className="package-cost">$1,000</p>
              <p className="package-desc">Gather friends and family in a beautiful church ceremony with a dinner reception.</p>
              <span className="package-benefit">+15 Starting Parent Mood</span>
            </div>

            {/* Lavish Gala */}
            <div 
              className={`package-card glass-panel ${selectedStyle === 'lavish' ? 'active' : ''} ${money < 4000 ? 'disabled' : ''}`}
              onClick={() => {
                if (money >= 4000) {
                  setSelectedStyle('lavish');
                  setErrorMessage('');
                } else {
                  setErrorMessage("Not enough money for a Lavish Gala!");
                }
              }}
            >
              <div className="package-icon">🏰</div>
              <h3>Lavish Gala</h3>
              <p className="package-cost">$4,000</p>
              <p className="package-desc">An extravagant fairytale castle wedding with high-profile guests and press.</p>
              <span className="package-benefit">+30 Parent Mood • +5 Heir Career & Charm</span>
            </div>
          </div>
        </section>

        {/* Heir Naming Section */}
        <section className="naming-section glass-panel">
          <h2>Name Your Child</h2>
          <p className="naming-instructions">
            Your child will be the protagonist of the next generation. Choose their name:
          </p>
          <div className="naming-input-group">
            <input 
              type="text" 
              className="child-name-input"
              value={childName}
              placeholder="Enter heir name..."
              onChange={(e) => { setChildName(e.target.value); setErrorMessage(''); }}
              maxLength={20}
            />
          </div>
          <div className="suggestions-list">
            {SUGGESTIONS.map((name) => (
              <button 
                key={name}
                type="button"
                className={`suggestion-btn ${childName === name ? 'active' : ''}`}
                onClick={() => handleSuggestionClick(name)}
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        {/* Action Button & Errors */}
        <footer className="marriage-footer">
          {errorMessage && <p className="error-message">⚠️ {errorMessage}</p>}
          <button 
            type="button" 
            className="btn-primary start-ceremony-btn"
            onClick={handleStartShift}
          >
            💍 Complete Ceremony & Welcome Baby!
          </button>
        </footer>
      </div>
    </div>
  );
};

export default MarriageCeremony;
