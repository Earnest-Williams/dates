import React, { useState } from 'react';
import { useGameStore } from '../state/store';
import { abilities } from '../data/abilities';
import DashboardHeader from './dashboard/DashboardHeader';
import NeedsPanel from './dashboard/NeedsPanel';
import StatsPanel from './dashboard/StatsPanel';
import HousingPanel from './dashboard/HousingPanel';
import FurnitureManager from './dashboard/FurnitureManager';
import DailyRoutinePanel from './dashboard/DailyRoutinePanel';
import RelationshipsPanel from './dashboard/RelationshipsPanel';
import PromisesPanel from './dashboard/PromisesPanel';
import OpportunitiesPanel from './dashboard/OpportunitiesPanel';
import MoneyRiskPanel from './dashboard/MoneyRiskPanel';
import './Dashboard.css';

const Dashboard = ({ onOpenSwipe, onOpenMap, onOpenSimstagram, onOpenCareer }) => {
  const [activeTab, setActiveTab] = useState('life');

  const { 
    gameState, 
    performAction, 
    sleep, 
    eat, 
    shower, 
    useAbility,
    doRoutine
  } = useGameStore();

  const { healthLow, healthCritical, moodDepressed, moodHigh, energy, hunger } = gameState.needs;
  const { money } = gameState.stats;
  const { utilitiesActive } = gameState.living;
  const { activeTraits, placedFurniture } = gameState;

  const hasGasRange = placedFurniture.includes('gas_range');
  const hasHotPlate = placedFurniture.includes('hot_plate');
  const hasSmartFridge = placedFurniture.includes('smart_fridge');
  const hasBookshelf = placedFurniture.includes('bookshelf');

  // Dynamic stat gains
  let currentStudyGain = 2;
  if (moodHigh) currentStudyGain *= 1.5;
  if (hasBookshelf) currentStudyGain *= 1.25;

  let currentFitnessGain = 2;
  if (healthLow) currentFitnessGain *= 0.5;

  // Energy costs
  const studyEnergyCost = 15;
  const workoutEnergyCost = 20;

  const homeSettlements = { 0: 'Endleigh', 1: 'Endleigh', 2: 'Stagborough', 3: 'Brockleigh' };
  const homeSettlement = homeSettlements[gameState.stats.housingTier] || 'Endleigh';
  const isAtHome = gameState.activeLocation === homeSettlement;

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
      <DashboardHeader />

      {activeTraits?.includes('burned_out') && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '1rem', margin: '0 2rem 1rem', borderRadius: '8px', color: '#fca5a5' }}>
          <strong>⚠️ BURNED OUT!</strong> Your energy dropped too low. Stat gains are halved and your mood is suffering. Sleep immediately or visit the Hospital to recover!
        </div>
      )}

      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === 'life' ? 'active' : ''}`} onClick={() => setActiveTab('life')}>Life</button>
        <button className={`tab-btn ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>Social</button>
        <button className={`tab-btn ${activeTab === 'planning' ? 'active' : ''}`} onClick={() => setActiveTab('planning')}>Planning</button>
      </div>

      <div className={`bento-grid ${activeTab}-grid`}>
        {activeTab === 'life' && (
          <>
            <NeedsPanel />
            <DailyRoutinePanel gameState={gameState} doRoutine={doRoutine} />
            <FurnitureManager />
          </>
        )}

        {activeTab === 'social' && (
          <>
            <RelationshipsPanel />
            <PromisesPanel />
            <OpportunitiesPanel onOpenMap={onOpenMap} />
          </>
        )}

        {activeTab === 'planning' && (
          <>
            <MoneyRiskPanel />
            <HousingPanel />
            <StatsPanel />
            <div className="bento-card perks-panel perks">
              <h2 className="section-title">Active Perks & Traits</h2>
              <div className="perks-grid">
                {activeTraits?.map(trait => (
                  <span key={trait} className="perk-badge trait">{trait.toUpperCase()}</span>
                ))}
                {gameState.stats.fitness >= 50 && <span className="perk-badge stat-perk">Marathoner</span>}
                {gameState.stats.intelligence >= 50 && <span className="perk-badge stat-perk">Fast Learner</span>}
                {gameState.stats.charisma >= 50 && <span className="perk-badge stat-perk">Charmer</span>}
                {gameState.stats.style >= 50 && <span className="perk-badge stat-perk">Trendsetter</span>}
                {gameState.stats.corporate >= 50 && <span className="perk-badge stat-perk">Shark</span>}
                {gameState.stats.programming >= 50 && <span className="perk-badge stat-perk">Hacker</span>}
                {gameState.stats.marketing >= 50 && <span className="perk-badge stat-perk">Influencer</span>}
                {gameState.stats.finance >= 50 && <span className="perk-badge stat-perk">Wolf</span>}
                {gameState.stats.negotiation >= 50 && <span className="perk-badge stat-perk">Closer</span>}
                {gameState.stats.culinary >= 50 && <span className="perk-badge stat-perk">Iron Stomach</span>}
                {gameState.stats.creativity >= 50 && <span className="perk-badge stat-perk">Visionary</span>}
                {gameState.stats.music >= 50 && <span className="perk-badge stat-perk">Virtuoso</span>}
                {gameState.stats.gaming >= 50 && <span className="perk-badge stat-perk">Pro Gamer</span>}
                {gameState.stats.confidence >= 50 && <span className="perk-badge stat-perk">Iron Will</span>}
                {gameState.stats.socialIq >= 50 && <span className="perk-badge stat-perk">Social Butterfly</span>}
                {gameState.stats.empathy >= 50 && <span className="perk-badge stat-perk">Empath</span>}
                
                {activeTraits?.length === 0 && Object.values(gameState.stats).every(v => v < 50) && (
                  <span style={{ opacity: 0.5, fontSize: '0.85rem' }}>No active perks yet. Reach 50 in a stat.</span>
                )}
              </div>
            </div>

            <div className="bento-card logs">
              <h2 className="section-title">Activity Log</h2>
              <div className="logs-panel">
                {gameState.logs.map((log, index) => (
                  <div key={index} className="log-entry">{log}</div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Action Dock */}
      <div className="quick-actions-dock">
        {/* Core needs/actions */}
        <button className="dock-btn" onClick={() => sleep(8)} disabled={!isAtHome}>
          <span className="dock-icon">🛏️</span>
          <span className="dock-label">Sleep</span>
          <div className="dock-tooltip">{isAtHome ? "Sleep 8hrs (Energy & Mood)" : `Must be at home in ${homeSettlement}`}</div>
        </button>
        <button className="dock-btn" onClick={() => eat('cook')} disabled={!isAtHome || !canCook || money < groceryCost || !utilitiesActive}>
          <span className="dock-icon">🍳</span>
          <span className="dock-label">Cook</span>
          <div className="dock-tooltip">{isAtHome ? cookCostText : `Must be at home in ${homeSettlement}`}</div>
        </button>
        <button className="dock-btn" onClick={shower} disabled={!isAtHome || !utilitiesActive}>
          <span className="dock-icon">🚿</span>
          <span className="dock-label">Shower</span>
          <div className="dock-tooltip">{isAtHome ? "Clean Hygiene" : `Must be at home in ${homeSettlement}`}</div>
        </button>
        
        <div className="dock-divider"></div>

        {/* Work / Study */}
        <button className="dock-btn" onClick={onOpenCareer}>
          <span className="dock-icon">💼</span>
          <span className="dock-label">Career</span>
          <div className="dock-tooltip">Open Career Hub</div>
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
        <button className="dock-btn" onClick={onOpenSimstagram}>
          <span className="dock-icon">📸</span>
          <span className="dock-label">Simstagram</span>
          <div className="dock-tooltip">Open Simstagram App</div>
        </button>
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

        {/* Active Abilities (Unlocked via Stats) */}
        {Object.values(abilities).map(ability => {
           let unlocked = true;
           if (ability.statRequirement) {
             for (const [stat, req] of Object.entries(ability.statRequirement)) {
                if ((gameState.stats[stat] || 0) < req) unlocked = false;
             }
           }
           if (!unlocked) return null;

           return (
             <React.Fragment key={ability.id}>
               <div className="dock-divider"></div>
               {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
               <button className="dock-btn" onClick={() => useAbility(ability.id)} disabled={energy < ability.energyCost}>
                 <span className="dock-icon">✨</span>
                 <span className="dock-label" style={{ color: 'var(--neon-pink)' }}>{ability.name}</span>
                 <div className="dock-tooltip">{ability.description} (⚡ {ability.energyCost})</div>
               </button>
             </React.Fragment>
           );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
