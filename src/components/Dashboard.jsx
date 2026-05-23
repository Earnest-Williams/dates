import { useGame } from '../state/GameContext';
import { ITEMS } from '../state/ItemDatabase';
import { HOUSING_TIERS } from '../data/housing';
import { calculateWorkSalary } from '../sim/economy';
import './Dashboard.css';

const NeedRing = ({ label, value, displayValue, displayInverse, color }) => {
  const finalDisplay = displayInverse ? displayValue : Math.round(value);
  const normalizedRadius = 36;
  const circumference = normalizedRadius * 2 * Math.PI;
  const percent = displayInverse ? (100 - value) : value; // For hunger, starvation means ring is empty if hunger is high
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  
  return (
    <div className={`circular-ring ${(percent < 20) ? 'ring-danger' : ''}`} style={{ color }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg className="ring-svg">
          <circle className="ring-bg" cx="40" cy="40" r={normalizedRadius} />
          <circle 
            className="ring-fill" 
            cx="40" 
            cy="40" 
            r={normalizedRadius} 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            stroke={color} 
          />
        </svg>
        <div className="ring-value" style={{ color: '#fff' }}>
          {finalDisplay}
        </div>
      </div>
      <span className="ring-label">{label}</span>
    </div>
  );
};

const StatBar = ({ label, value, color }) => (
  <div className="stat-item">
    <div className="stat-header">
      <span>{label}</span>
      <span>{value}/100</span>
    </div>
    <div className="stat-bar-bg">
      <div className="stat-bar-fill" style={{ width: `${value}%`, backgroundColor: color }}></div>
    </div>
  </div>
);

const Dashboard = ({ onOpenSwipe, onOpenMap }) => {
  const { 
    gameState, 
    getFormattedTime, 
    performAction, 
    sleep, 
    eat, 
    shower, 
    payBills, 
    upgradeHousing,
    placeFurniture,
    storeFurniture
  } = useGame();

  const { day } = gameState.time;
  const { 
    money, fitness, intelligence, charisma, style, housingTier,
    corporate, programming, marketing, finance, negotiation,
    culinary, creativity, music, gaming, confidence, socialIq, empathy 
  } = gameState.stats;
  const { energy, hunger, hygiene, health, mood } = gameState.needs;
  const { utilitiesActive, billsAmount } = gameState.living;
  const currentHousing = HOUSING_TIERS[housingTier];

  // Dynamic calculations based on placed furniture
  const placedItems = gameState.placedFurniture || [];
  const storedItems = gameState.storage || [];
  const occupiedSlots = placedItems.reduce((sum, id) => sum + (ITEMS[id]?.slots || 0), 0);

  const placedBed = placedItems.find(id => ITEMS[id]?.category === 'bed');
  const bedName = placedBed ? ITEMS[placedBed].name : "None (Floor/Couch)";
  const sleepMultiplier = placedBed && ITEMS[placedBed] ? ITEMS[placedBed].energyMultiplier : 1.0;

  const hasGasRange = placedItems.includes('gas_range');
  const hasHotPlate = placedItems.includes('hot_plate');
  const hasSmartFridge = placedItems.includes('smart_fridge');
  const hasBookshelf = placedItems.includes('bookshelf');

  // Status checks for disabling actions
  const healthLow = health < 50;
  const healthCritical = health < 20;
  const moodDepressed = mood < 30;
  const moodHigh = mood >= 70;

  // Dynamic work earnings (boosted by negotiation)
  const negotiationBonus = 1 + (negotiation || 10) * 0.01;
  const baseWorkEarnings = calculateWorkSalary(corporate);
  const finalBaseWorkEarnings = Math.floor(baseWorkEarnings * negotiationBonus);
  const workEarnings = healthLow ? Math.floor(finalBaseWorkEarnings * 0.5) : finalBaseWorkEarnings;

  // Dynamic stat gains
  let currentStudyGain = 2;
  if (moodHigh) currentStudyGain *= 1.5;
  if (hasBookshelf) currentStudyGain *= 1.25;

  let currentFitnessGain = 2;
  if (healthLow) currentFitnessGain *= 0.5;

  // Energy costs
  const studyEnergyCost = 15;
  const workoutEnergyCost = 20;
  const workEnergyCost = 35;

  let cookCostText = "Needs Hot Plate or Gas Range";
  let canCook = hasGasRange || hasHotPlate;
  let groceryCost = 0;
  
  if (hasGasRange) {
    groceryCost = hasSmartFridge ? 5 : 10;
    cookCostText = `30 mins • -$${groceryCost} • -60 Hunger, +15 Mood`;
  } else if (hasHotPlate) {
    groceryCost = hasSmartFridge ? 2.5 : 5;
    cookCostText = `30 mins • -$${groceryCost} • -30 Hunger`;
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1 className="text-gradient">Life Sim</h1>
          <p className="time-display" style={{ color: 'var(--text-secondary)' }}>
            <strong>{gameState.family.playerName} (Gen {gameState.family.generation})</strong> • Day {day} • {getFormattedTime()} (At {gameState.activeLocation.toUpperCase()})
          </p>
          {!utilitiesActive && <p className="utility-warning">⚠️ UTILITIES DISCONNECTED! Pay bills to restore power.</p>}
          {healthCritical && <p className="utility-warning">⚠️ CRITICAL HEALTH! You are too sick to work or study. Visit the hospital!</p>}
          {moodDepressed && <p className="utility-warning">⚠️ DEPRESSED! Too depressed to work or study. Watch TV, talk to matches, or dine out!</p>}
        </div>
        <div>
          <p className="money-display">${money}</p>
        </div>
      </header>

      <div className="bento-grid">
        {/* Needs Panel */}
        <div className="bento-card needs">
          <h2 className="section-title">Vitals & Needs</h2>
          <div className="needs-rings-container">
            <NeedRing label="Energy" value={energy} color={energy < 30 ? "#f87171" : "var(--accent-pink)"} />
            <NeedRing label="Hunger" value={100 - hunger} displayValue={hunger} displayInverse color={hunger > 70 ? "#f87171" : "#fbbf24"} />
            <NeedRing label="Hygiene" value={hygiene} color={hygiene < 30 ? "#f87171" : "var(--accent-blue)"} />
            <NeedRing label="Health" value={health} color={health < 30 ? "#f87171" : "#10b981"} />
            <NeedRing label="Mood" value={mood} color={mood < 30 ? "#f87171" : "#f59e0b"} />
          </div>
        </div>

        {/* Core Attributes */}
        <div className="bento-card core">
          <h2 className="section-title">Core Attributes</h2>
          <div className="stats-list">
            <StatBar label="Fitness" value={fitness} color="var(--accent-pink)" />
            <StatBar label="Intelligence" value={intelligence} color="var(--accent-purple)" />
            <StatBar label="Charisma" value={charisma} color="#f472b6" />
            <StatBar label="Style" value={style} color="#a78bfa" />
          </div>
        </div>

        {/* Professional Skills */}
        <div className="bento-card prof">
          <h2 className="section-title">Professional Skills</h2>
          <div className="stats-list">
            <StatBar label="Corporate" value={corporate} color="var(--accent-blue)" />
            <StatBar label="Programming" value={programming || 10} color="#8b5cf6" />
            <StatBar label="Marketing" value={marketing || 10} color="#f97316" />
            <StatBar label="Finance" value={finance || 10} color="#14b8a6" />
            <StatBar label="Negotiation" value={negotiation || 10} color="#06b6d4" />
          </div>
        </div>

        {/* Lifestyle Skills */}
        <div className="bento-card lifestyle">
          <h2 className="section-title">Lifestyle Skills</h2>
          <div className="stats-list">
            <StatBar label="Culinary" value={culinary || 10} color="#10b981" />
            <StatBar label="Creativity" value={creativity || 10} color="#ec4899" />
            <StatBar label="Music" value={music || 10} color="#f43f5e" />
            <StatBar label="Gaming" value={gaming || 10} color="#8b5cf6" />
          </div>
        </div>

        {/* Social Traits */}
        <div className="bento-card social">
          <h2 className="section-title">Social Traits</h2>
          <div className="stats-list">
            <StatBar label="Confidence" value={confidence || 10} color="#fbbf24" />
            <StatBar label="Social IQ" value={socialIq || 10} color="#3b82f6" />
            <StatBar label="Empathy" value={empathy || 10} color="#fce7f3" />
          </div>
        </div>

        {/* Housing */}
        <div className="bento-card housing">
          <h2 className="section-title">Housing: {currentHousing.name}</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            <p>{currentHousing.desc}</p>
            {housingTier > 0 && <p style={{ marginTop: '0.5rem', color: '#f87171' }}>Rent: ${currentHousing.rent}/week</p>}
            <p>Bed: {bedName} (x{sleepMultiplier.toFixed(2)} Energy)</p>
            <p>Capacity: {occupiedSlots} / {currentHousing.slots} Slots</p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              {!utilitiesActive && <button className="btn-mini" onClick={payBills}>Pay Bills (${billsAmount})</button>}
              {HOUSING_TIERS[housingTier + 1] && (
                <button className="btn-mini" onClick={upgradeHousing}>Upgrade (${HOUSING_TIERS[housingTier + 1].rent * 2})</button>
              )}
            </div>
          </div>
        </div>

        {/* Furniture Manager */}
        <div className="bento-card furniture">
          <h2 className="section-title">Interior & Storage</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Placed Items</h3>
              <div className="furniture-items-grid">
                {placedItems.map((itemKey, idx) => {
                  const item = ITEMS[itemKey];
                  if (!item) return null;
                  return (
                    <div key={`placed-${idx}`} className="furniture-mini-card">
                      <div className="furniture-card-header">
                        <span className="furniture-card-name">{item.name}</span>
                      </div>
                      <button className="btn-mini btn-store" onClick={() => storeFurniture(itemKey)}>Store</button>
                    </div>
                  );
                })}
                {placedItems.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No items placed.</p>}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Storage Unit</h3>
              <div className="furniture-items-grid">
                {storedItems.map((itemKey, idx) => {
                  const item = ITEMS[itemKey];
                  if (!item) return null;
                  const canPlace = (occupiedSlots + item.slots) <= currentHousing.slots;
                  return (
                    <div key={`stored-${idx}`} className="furniture-mini-card">
                      <div className="furniture-card-header">
                        <span className="furniture-card-name">{item.name}</span>
                      </div>
                      <button className="btn-mini btn-place" onClick={() => placeFurniture(itemKey)} disabled={!canPlace}>Place</button>
                    </div>
                  );
                })}
                {storedItems.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Storage is empty.</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Lineage */}
        <div className="bento-card lineage">
          <h2 className="section-title">Generational Lineage</h2>
          {gameState.family.parentHistory?.length > 0 ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {gameState.family.parentHistory.map((history, idx) => (
                <p key={idx} style={{ marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  Gen {history.generation}: <strong>{history.parentName}</strong> & {history.spouseName || 'Spouse'} (Retired Day {history.dayReached})
                </p>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>You are the first generation.</p>
          )}
        </div>

        {/* Logs */}
        <div className="bento-card logs">
          <h2 className="section-title">Activity Log</h2>
          <div className="logs-panel">
            {gameState.logs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Dock */}
      <div className="quick-actions-dock">
        {/* Core needs/actions */}
        <button className="dock-btn" onClick={() => sleep(8)}>
          <span className="dock-icon">🛏️</span>
          <span className="dock-label">Sleep</span>
          <div className="dock-tooltip">Sleep 8hrs (Energy & Mood)</div>
        </button>
        <button className="dock-btn" onClick={() => eat('cook')} disabled={!canCook || money < groceryCost || !utilitiesActive}>
          <span className="dock-icon">🍳</span>
          <span className="dock-label">Cook</span>
          <div className="dock-tooltip">{cookCostText}</div>
        </button>
        <button className="dock-btn" onClick={shower} disabled={!utilitiesActive}>
          <span className="dock-icon">🚿</span>
          <span className="dock-label">Shower</span>
          <div className="dock-tooltip">Clean Hygiene</div>
        </button>
        
        <div className="dock-divider"></div>

        {/* Work / Study */}
        <button className="dock-btn" onClick={() => performAction('Work (8hrs)', 48, { corporate: 1 }, workEnergyCost, workEarnings)} disabled={energy < workEnergyCost || hunger >= 95 || healthCritical || moodDepressed}>
          <span className="dock-icon">💼</span>
          <span className="dock-label">Work</span>
          <div className="dock-tooltip">Work 8hrs (+${workEarnings})</div>
        </button>
        <button className="dock-btn" onClick={() => performAction('Study (2hrs)', 12, { intelligence: 2 }, studyEnergyCost)} disabled={energy < studyEnergyCost || hunger >= 95 || healthCritical || moodDepressed}>
          <span className="dock-icon">📚</span>
          <span className="dock-label">Study</span>
          <div className="dock-tooltip">Study 2hrs (+{currentStudyGain} Int)</div>
        </button>
        <button className="dock-btn" onClick={() => performAction('Workout (1hr)', 6, { fitness: 2 }, workoutEnergyCost)} disabled={energy < workoutEnergyCost || hunger >= 95 || healthCritical}>
          <span className="dock-icon">💪</span>
          <span className="dock-label">Gym</span>
          <div className="dock-tooltip">Workout 1hr (+{currentFitnessGain} Fit)</div>
        </button>

        <div className="dock-divider"></div>

        {/* Social / Dating */}
        <button className="dock-btn" onClick={onOpenSwipe}>
          <span className="dock-icon">📱</span>
          <span className="dock-label">LinkUp</span>
          <div className="dock-tooltip">Open Dating App</div>
        </button>
        <button className="dock-btn" onClick={onOpenMap}>
          <span className="dock-icon">🗺️</span>
          <span className="dock-label">Travel</span>
          <div className="dock-tooltip">Visit locations in the city</div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
