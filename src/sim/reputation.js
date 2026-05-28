export const REPUTATION_CIRCLES = {
  coworkers: ['marcus', 'nora'],
  friends: ['brad'],
  nightlife: ['sophia', 'rina'],
  creative: ['chloe', 'maya'],
  academic: ['elena'],
  exes: []
};

export const selectRelevantReputationCircle = (npcId) => {
  for (const [circle, npcs] of Object.entries(REPUTATION_CIRCLES)) {
    if (npcs.includes(npcId)) return circle;
  }
  return null;
};

export const adjustReputationForPublicDate = (state, npcId, locationKey) => {
  const circle = selectRelevantReputationCircle(npcId);
  if (!circle) return state.reputation || {};

  // For example, going to a high-visibility location increases reputation in that circle
  const currentRep = state.reputation?.[circle] || 0;
  
  // Very naive example
  let newRep = currentRep;
  if (locationKey === 'club' && circle === 'nightlife') newRep += 2;
  if (locationKey === 'office' && circle === 'coworkers') newRep += 2;
  if (locationKey === 'library' && circle === 'academic') newRep += 2;
  
  return {
    ...(state.reputation || {}),
    [circle]: Math.min(100, Math.max(-100, newRep))
  };
};

export const calculateGossipRisk = (state, npcId, locationKey) => {
  const circle = selectRelevantReputationCircle(npcId);
  const rep = state.reputation?.[circle] || 0;
  
  if (rep > 20) return 0.5; // High reputation -> higher gossip risk
  if (rep < -20) return 0.8; // Bad reputation -> high gossip risk
  return 0.1;
};

export const calculateRepairReputationModifier = (state, npcId) => {
  const circle = selectRelevantReputationCircle(npcId);
  const rep = state.reputation?.[circle] || 0;
  
  if (rep > 20) return 1.2; // Easier to repair if well-liked in circle
  if (rep < -20) return 0.8; // Harder to repair if disliked in circle
  return 1.0;
};
