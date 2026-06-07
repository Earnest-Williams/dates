import { useState } from 'react';
import { useGameStore } from '../state/store';
import { NPCS } from '../state/NpcDatabase';
import InvestmentApp from './InvestmentApp';
import './SwipeApp.css';

const PREFERENCE_OPTIONS = [
  { label: 'All Personalities', value: '' },
  { label: 'Intellectuals (Intelligence)', value: 'intelligence' },
  { label: 'Ambitious (Corporate)', value: 'corporate' },
  { label: 'Athletes (Fitness)', value: 'fitness' },
  { label: 'Charismatic (Charisma)', value: 'charisma' },
  { label: 'Fashionable (Style)', value: 'style' }
];

const SEX_PREFERENCE_OPTIONS = [
  { label: 'Everyone', value: 'anyone' },
  { label: 'Men', value: 'male' },
  { label: 'Women', value: 'female' }
];

const SwipeApp = ({ onClose, onTalkNpc }) => {
  const swipeNpc = useGameStore(state => state.swipeNpc);
  const subscribePremium = useGameStore(state => state.subscribePremium);
  const cancelPremium = useGameStore(state => state.cancelPremium);
  const updateSwipePreferences = useGameStore(state => state.updateSwipePreferences);
  const instantMatch = useGameStore(state => state.instantMatch);

  const matches = useGameStore(state => state.gameState.matches);
  const swipePreferences = useGameStore(state => state.gameState.swipePreferences);
  const swipePremium = useGameStore(state => state.gameState.swipePremium);
  const swipeStats = useGameStore(state => state.gameState.swipeStats);
  const currentDay = useGameStore(state => state.gameState.time.day);
  const utilitiesActive = useGameStore(state => state.gameState.living.utilitiesActive);
  const hygiene = useGameStore(state => state.gameState.needs.hygiene);
  const money = useGameStore(state => state.gameState.stats.money);

  const [activeTab, setActiveTab] = useState('swipe'); // 'swipe', 'preferences', 'premium', 'admirers', 'invest'
  const [currentIndex, setCurrentIndex] = useState(0);

  const preferredStat = swipePreferences?.preferredStat || '';
  const isPremium = swipePremium?.active || false;

  // Swiping limit calculations
  const lastDay = swipeStats?.lastSwipedDay || 1;
  const swipeCount = currentDay !== lastDay ? 0 : (swipeStats?.dailySwipesCount || 0);
  const swipesLeft = Math.max(0, 5 - swipeCount);

  const sexPreference = swipePreferences?.sexPreference || 'anyone';

  // Filter swiping pool (unmatched NPCs)
  const swipePool = NPCS.filter(npc => {
    if (matches[npc.id]) return false;
    if (sexPreference !== 'anyone' && npc.gender !== sexPreference) return false;
    return true;
  });
  
  // Sort swiping pool so NPCs matching preference stat appear first
  if (preferredStat) {
    const npcPrimaryStatMap = {
      elena: 'intelligence',
      sophia: 'style',
      chloe: 'charisma',
      rina: 'style',
      maya: 'charisma',
      nora: 'corporate'
    };
    swipePool.sort((a, b) => {
      const aMatch = npcPrimaryStatMap[a.id] === preferredStat;
      const bMatch = npcPrimaryStatMap[b.id] === preferredStat;
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    });
  }

  const activeNpc = swipePool[currentIndex];

  const handleSwipe = (direction) => {
    if (!activeNpc) return;
    const success = swipeNpc(activeNpc.id, direction);
    if (success) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleSubscribe = () => {
    subscribePremium();
  };

  const handleCancelPremium = () => {
    cancelPremium();
  };

  const handlePreferenceChange = (key, val) => {
    updateSwipePreferences({ [key]: val });
  };

  const handleInstantMatch = (npcId) => {
    instantMatch(npcId);
  };

  if (!utilitiesActive) {
    return (
      <div className="glass-panel swipe-container animate-fade-in">
        <header className="swipe-header">
          <h3>LinkUp Dating</h3>
          <button className="btn-mini" onClick={onClose}>Close</button>
        </header>
        <div className="swipe-error-state">
          <p>📡 Connection Offline</p>
          <span>You need an internet connection to use LinkUp. Please pay your bills.</span>
        </div>
      </div>
    );
  }

  if (hygiene < 30) {
    return (
      <div className="glass-panel swipe-container animate-fade-in">
        <header className="swipe-header">
          <h3>LinkUp Dating</h3>
          <button className="btn-mini" onClick={onClose}>Close</button>
        </header>
        <div className="swipe-error-state">
          <p>🤢 Profile Hidden</p>
          <span>Your hygiene is too low! Take a shower before swiping on people.</span>
        </div>
      </div>
    );
  }

  // Active matches list
  const activeMatches = NPCS.filter(npc => matches[npc.id]);
  // Secret admirers (unmatched NPCs)
  const secretAdmirers = NPCS.filter(npc => !matches[npc.id]);

  return (
    <div className="glass-panel swipe-container animate-fade-in">
      <header className="swipe-header">
        <div className="app-brand-section">
          <h3>LinkUp Dating</h3>
          {isPremium && <span className="premium-gold-badge">GOLD</span>}
        </div>
        <button className="btn-mini" onClick={onClose}>Close</button>
      </header>

      {/* Internal Navigation Tabs */}
      <nav className="swipe-nav">
        <button className={`nav-tab-btn ${activeTab === 'swipe' ? 'active' : ''}`} onClick={() => setActiveTab('swipe')}>
          🎴 Swipe
        </button>
        <button className={`nav-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`} onClick={() => setActiveTab('preferences')}>
          ⚙️ Preferences
        </button>
        <button className={`nav-tab-btn ${activeTab === 'admirers' ? 'active' : ''}`} onClick={() => setActiveTab('admirers')}>
          👥 Secret Admirers
        </button>
        <button className={`nav-tab-btn ${activeTab === 'premium' ? 'active' : ''}`} onClick={() => setActiveTab('premium')}>
          👑 Premium
        </button>
        <button className={`nav-tab-btn ${activeTab === 'invest' ? 'active' : ''}`} onClick={() => setActiveTab('invest')}>
          📈 Invest
        </button>
      </nav>

      {activeTab === 'invest' ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem 0' }}>
          <InvestmentApp onClose={onClose} />
        </div>
      ) : (
        <div className="swipe-app-grid">
        {/* Main Interactive Screen */}
        <div className="swipe-card-section">
          {activeTab === 'swipe' && (
            <>
              {!isPremium && (
                <div className="swipe-limits-badge">
                  Daily Swipes Left: <strong>{swipesLeft} / 5</strong>
                </div>
              )}
              {!isPremium && swipesLeft === 0 ? (
                <div className="admirers-locked-state glass-panel animate-fade-in" style={{ maxWidth: '340px' }}>
                  <span className="lock-icon" style={{ fontSize: '2.5rem' }}>⏳</span>
                  <h4>Daily Swipes Exhausted</h4>
                  <p>You have used all 5 free swipes for today. Swipe count resets daily when the calendar day advances.</p>
                  <button className="btn-primary btn-gold" style={{ marginTop: '0.5rem' }} onClick={() => setActiveTab('premium')}>
                    👑 Go Gold for Unlimited Swipes
                  </button>
                </div>
              ) : activeNpc ? (
                <div className="swipe-card animate-fade-in">
                  <div className="swipe-portrait" style={{ overflow: 'hidden' }}>
                    <div className="avatar-placeholder">
                      {activeNpc.name.charAt(0)}
                    </div>
                    <div className="swipe-portrait-overlay">
                      <h4>{activeNpc.name}, 24</h4>
                      {isPremium && <span className="premium-revealed-badge">🔥 Match Boost Active</span>}
                    </div>
                  </div>
                  <div className="swipe-details">
                    <p className="swipe-desc">{activeNpc.description}</p>
                    <div className="swipe-gating">
                      {activeNpc.gatedBy && (
                        isPremium ? (
                          <span className="gate-tag revealed">
                            💡 Requirement Revealed: {activeNpc.gatedBy.message}
                          </span>
                        ) : (
                          <span className="gate-tag">🔒 Access Gated (Requires Premium details)</span>
                        )
                      )}
                    </div>
                  </div>
                  <div className="swipe-actions">
                    <button className="btn-swipe pass" onClick={() => handleSwipe('left')}>❌ Pass</button>
                    <button className="btn-swipe like" onClick={() => handleSwipe('right')}>❤️ Like</button>
                  </div>
                </div>
              ) : (
                <div className="swipe-empty-state">
                  <p>🎉 Out of Profiles</p>
                  <span>You've swiped on everyone in your area. Check back tomorrow!</span>
                </div>
              )}
            </>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-panel animate-fade-in">
              <h4>Dating Preferences</h4>
              <p className="section-desc">Specify what traits you find most attractive. Matching stats gives a <strong>+20% bonus</strong> to matching success, while others receive a <strong>-10% penalty</strong>.</p>
              
              <div className="preference-list-grid">
                {PREFERENCE_OPTIONS.map(opt => {
                  const isActive = preferredStat === opt.value;
                  return (
                    <button 
                      key={opt.value}
                      className={`preference-opt-card ${isActive ? 'active' : ''}`}
                      onClick={() => handlePreferenceChange('preferredStat', opt.value)}
                    >
                      <span className="pref-icon">{isActive ? '🟢' : '⚪'}</span>
                      <span className="pref-label">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <h4 style={{ marginTop: '2rem' }}>Gender Preference</h4>
              <p className="section-desc">Who would you like to see in your swipe deck?</p>
              <div className="preference-list-grid">
                {SEX_PREFERENCE_OPTIONS.map(opt => {
                  const isActive = sexPreference === opt.value;
                  return (
                    <button 
                      key={opt.value}
                      className={`preference-opt-card ${isActive ? 'active' : ''}`}
                      onClick={() => handlePreferenceChange('sexPreference', opt.value)}
                    >
                      <span className="pref-icon">{isActive ? '🟢' : '⚪'}</span>
                      <span className="pref-label">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'admirers' && (
            <div className="admirers-panel animate-fade-in">
              <h4>Secret Admirers</h4>
              <p className="section-desc">These people swiped right on you. You can match with them instantly, bypassing stat requirements!</p>
              
              {isPremium ? (
                <div className="admirers-list-grid">
                  {secretAdmirers.map(npc => (
                    <div key={npc.id} className="admirer-card glass-panel">
                      <div className="admirer-avatar">
                        {npc.name.charAt(0)}
                      </div>
                      <div className="admirer-info">
                        <h5>{npc.name}</h5>
                        <span>Likes your profile!</span>
                      </div>
                      <button className="btn-mini btn-gold-match" onClick={() => handleInstantMatch(npc.id)}>
                        ⚡ Instant Match
                      </button>
                    </div>
                  ))}
                  {secretAdmirers.length === 0 && (
                    <p className="empty-admirers">You've matched with all your admirers!</p>
                  )}
                </div>
              ) : (
                <div className="admirers-locked-state glass-panel">
                  <span className="lock-icon">🔒</span>
                  <h4>Unlock Secret Admirers</h4>
                  <p>Upgrade to **LinkUp Gold** to see who liked your profile and match with them instantly, bypassing all stat requirements!</p>
                  <button className="btn-primary btn-gold" onClick={() => setActiveTab('premium')}>
                    Get LinkUp Gold ($15/wk)
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'premium' && (
            <div className="premium-panel animate-fade-in">
              <div className="premium-hero glass-panel">
                <span className="crown-icon">👑</span>
                <h3>LinkUp Gold</h3>
                <p>Maximize your dating life with exclusive features.</p>
              </div>

              <div className="premium-features-list">
                <div className="feature-item">
                  <span className="check-bullet">✅</span>
                  <div>
                    <strong>Instant Match</strong>
                    <span>Skip stat requirements and connect with Secret Admirers immediately.</span>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="check-bullet">✅</span>
                  <div>
                    <strong>Reveal Requirements</strong>
                    <span>See the exact gates (e.g. Career, Education thresholds) on locked profiles.</span>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="check-bullet">✅</span>
                  <div>
                    <strong>Unlimited Swipes</strong>
                    <span>Swipe without daily limits (standard limits cap free users at 5 swipes/day).</span>
                  </div>
                </div>
                <div className="feature-item">
                  <span className="check-bullet">✅</span>
                  <div>
                    <strong>+20% Match Probability Boost</strong>
                    <span>Get priority visibility and higher baseline match chances on all swipes.</span>
                  </div>
                </div>
              </div>

              <div className="premium-billing-action text-center">
                {isPremium ? (
                  <div className="premium-active-box">
                    <p className="status-title">✨ LinkUp Gold Active</p>
                    <p className="status-desc">Weekly fee of $15 is charged automatically on Day 7 boundaries.</p>
                    <button className="btn-secondary btn-cancel-premium" onClick={handleCancelPremium}>
                      Cancel Subscription
                    </button>
                  </div>
                ) : (
                  <div className="premium-inactive-box">
                    <p className="status-price">$15 / week</p>
                    <button 
                      className="btn-primary btn-subscribe-premium" 
                      onClick={handleSubscribe}
                      disabled={money < 15}
                    >
                      {money >= 15 ? "Subscribe Now" : "Insufficient Funds (Need $15)"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Matches Inbox Area */}
        <div className="swipe-inbox-section">
          <h4>Your Matches ({activeMatches.length})</h4>
          <div className="matches-list">
            {activeMatches.map(npc => {
              const rel = matches[npc.id].relationship;
              return (
                <div 
                  key={npc.id} 
                  className="match-inbox-item animate-fade-in"
                  onClick={() => onTalkNpc(npc.id)}
                >
                  <div className="match-avatar">
                    {npc.name.charAt(0)}
                  </div>
                  <div className="match-info">
                    <span className="match-name">{npc.name}</span>
                    <span className="match-status">Relationship: {rel}/100</span>
                  </div>
                </div>
              );
            })}
            {activeMatches.length === 0 && (
              <p className="no-matches-msg">No matches yet. Start swiping right!</p>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default SwipeApp;
