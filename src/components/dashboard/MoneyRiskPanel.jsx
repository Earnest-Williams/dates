import React from 'react';
import { useGameStore } from '../../state/store';
import { HOUSING_TIERS } from '../../data/housing';
import { CAREER_TRACKS } from '../../data/projects';
import { getBusinessById } from '../../data/businesses';

const MoneyRiskPanel = () => {
  const { stats, career, living, time } = useGameStore(state => state.gameState);
  
  const { money, housingTier } = stats;
  const currentHousing = HOUSING_TIERS[housingTier];
  const rentWaived = living?.rentWaivedUntilDay >= time.day && living?.rentWaivedHousingTier === housingTier;
  const rent = housingTier > 0 && !rentWaived ? currentHousing.rent : 0;
  
  const activeCareer = career?.activeTrack ? CAREER_TRACKS[career.activeTrack] : null;
  const currentLevel = activeCareer ? activeCareer.levels.find(level => level.level === career.titleLevel) : null;
  const employer = career?.employerId ? getBusinessById(career.employerId) : null;
  const income = currentLevel ? currentLevel.salary : 0;

  return (
    <div className="bento-card money-risk">
      <h2 className="section-title">Money & Risk</h2>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        <p style={{ fontSize: '1.25rem', color: '#4ade80', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          ${money}
        </p>
        
        {housingTier > 0 && (
          <p style={{ color: rentWaived ? '#4ade80' : '#f87171', marginBottom: '0.5rem' }}>
            <strong>Rent:</strong> {rentWaived ? `Paid through Day ${living.rentWaivedUntilDay}` : `-$${rent} / week`}
          </p>
        )}
        
        {income > 0 ? (
          <>
            <p style={{ color: '#4ade80', marginBottom: '0.5rem' }}>
              <strong>Income:</strong> +${income} / week
            </p>
            {employer && (
              <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                <strong>Employer:</strong> {employer.name}
              </p>
            )}
          </>
        ) : (
          <p style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>
            <strong>Career:</strong> Unemployed
          </p>
        )}
        
        <div style={{ marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p><strong>Weekly Net:</strong> <span style={{ color: income - rent >= 0 ? '#4ade80' : '#f87171' }}>${income - rent}</span></p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MoneyRiskPanel);
