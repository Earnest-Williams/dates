import React from 'react';
import { useGameStore } from '../../state/store';

const DashboardHeader = () => {
  const getFormattedTime = useGameStore(state => state.getFormattedTime);
  const time = useGameStore(state => state.gameState.time);
  const family = useGameStore(state => state.gameState.family);
  const activeLocation = useGameStore(state => state.gameState.activeLocation);
  const needs = useGameStore(state => state.gameState.needs);
  const living = useGameStore(state => state.gameState.living);
  const stats = useGameStore(state => state.gameState.stats);
  const payTaxes = useGameStore(state => state.payTaxes);
  const toggleHealthInsurance = useGameStore(state => state.toggleHealthInsurance);

  const { day } = time;
  const { health, mood } = needs;
  const { utilitiesActive, hasHealthInsurance } = living;
  const { money, taxOwed } = stats;

  const healthCritical = health < 20;
  const moodDepressed = mood < 30;

  return (
    <header className="dashboard-header">
      <div>
        <h1 className="text-gradient">Life Sim</h1>
        <p className="time-display" style={{ color: 'var(--text-secondary)' }}>
          <strong>{family.playerName} (Gen {family.generation})</strong> • Day {day} • {getFormattedTime()} (At {activeLocation.toUpperCase()})
        </p>
        {!utilitiesActive && <p className="utility-warning">⚠️ UTILITIES DISCONNECTED! Pay bills to restore power.</p>}
        {healthCritical && <p className="utility-warning">⚠️ CRITICAL HEALTH! You are too sick to work or study. Visit the hospital!</p>}
        {moodDepressed && <p className="utility-warning">⚠️ DEPRESSED! Too depressed to work or study. Watch TV, talk to matches, or dine out!</p>}
        <div style={{ marginTop: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: hasHealthInsurance ? '#2ecc71' : '#e74c3c', marginRight: '10px' }}>
            Health Insurance: {hasHealthInsurance ? 'Active ($150/mo)' : 'Inactive (High Risk)'}
          </span>
          <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={toggleHealthInsurance}>
            {hasHealthInsurance ? 'Cancel' : 'Enroll'}
          </button>
        </div>
      </div>
      <div>
        <p className="money-display">${money}</p>
        {taxOwed > 0 && (
          <div style={{ marginTop: '10px' }}>
            <p style={{ color: '#e74c3c', fontSize: '0.9rem', fontWeight: 'bold' }}>Taxes Owed: ${taxOwed}</p>
            <button 
              className="btn-primary" 
              style={{ fontSize: '0.8rem', padding: '5px 10px', marginTop: '5px', backgroundColor: '#c0392b' }}
              onClick={payTaxes}
            >
              Pay Taxes
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default React.memo(DashboardHeader);
