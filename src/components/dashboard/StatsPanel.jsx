import React from 'react';
import { useGameStore } from '../../state/store';
import StatBar from './StatBar';

const StatsPanel = () => {
  const stats = useGameStore(state => state.gameState.stats);
  const { 
    fitness, intelligence, charisma, style, 
    corporate, programming, marketing, finance, negotiation, 
    culinary, creativity, music, gaming, 
    confidence, socialIq, empathy 
  } = stats;

  return (
    <>
      <div className="bento-card core-stats">
        <h2 className="section-title">Core Stats</h2>
        <div className="stats-list">
          <StatBar label="Fitness" value={fitness || 10} color="#ef4444" />
          <StatBar label="Intelligence" value={intelligence || 10} color="#3b82f6" />
          <StatBar label="Charisma" value={charisma || 10} color="#f59e0b" />
          <StatBar label="Style" value={style || 10} color="#ec4899" />
        </div>
      </div>

      <div className="bento-card career-skills">
        <h2 className="section-title">Career Skills</h2>
        <div className="stats-list">
          <StatBar label="Corporate" value={corporate || 10} color="#64748b" />
          <StatBar label="Programming" value={programming || 10} color="#8b5cf6" />
          <StatBar label="Marketing" value={marketing || 10} color="#f97316" />
          <StatBar label="Finance" value={finance || 10} color="#14b8a6" />
          <StatBar label="Negotiation" value={negotiation || 10} color="#06b6d4" />
        </div>
      </div>

      <div className="bento-card lifestyle">
        <h2 className="section-title">Lifestyle Skills</h2>
        <div className="stats-list">
          <StatBar label="Culinary" value={culinary || 10} color="#10b981" />
          <StatBar label="Creativity" value={creativity || 10} color="#ec4899" />
          <StatBar label="Music" value={music || 10} color="#f43f5e" />
          <StatBar label="Gaming" value={gaming || 10} color="#8b5cf6" />
        </div>
      </div>

      <div className="bento-card social">
        <h2 className="section-title">Social Traits</h2>
        <div className="stats-list">
          <StatBar label="Confidence" value={confidence || 10} color="#fbbf24" />
          <StatBar label="Social IQ" value={socialIq || 10} color="#3b82f6" />
          <StatBar label="Empathy" value={empathy || 10} color="#fce7f3" />
        </div>
      </div>
    </>
  );
};

export default React.memo(StatsPanel);
