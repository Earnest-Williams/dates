import React from 'react';
import { useGameStore } from '../../state/store';
import NeedRing from './NeedRing';

const NeedsPanel = () => {
  const needs = useGameStore(state => state.gameState.needs);
  const { energy, hunger, hygiene, health, mood } = needs;

  return (
    <div className="bento-card needs">
      <h2 className="section-title">Current Needs</h2>
      <div className="needs-rings">
        <NeedRing label="Energy" value={energy} color="#f1c40f" />
        <NeedRing label="Hunger" value={hunger} displayValue={Math.round(100 - hunger)} displayInverse color="#e67e22" />
        <NeedRing label="Hygiene" value={hygiene} color="#3498db" />
        <NeedRing label="Health" value={health} color="#e74c3c" />
        <NeedRing label="Mood" value={mood} color="#9b59b6" />
      </div>
    </div>
  );
};

export default React.memo(NeedsPanel);
