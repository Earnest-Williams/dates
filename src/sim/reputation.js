const clamp = (value, min = -100, max = 100) => Math.max(min, Math.min(max, value));

export const REPUTATION_CIRCLES = {
  coworkers: ['nora', 'olivia', 'james'],
  friends: ['emma', 'noah'],
  nightlife: ['sophia', 'rina', 'ava', 'alexander'],
  creative: ['chloe', 'maya', 'liam', 'isabella'],
  academic: ['elena', 'ethan', 'sofia'],
  exes: []
};

export const selectRelevantReputationCircle = (npcId) => {
  for (const [circle, npcs] of Object.entries(REPUTATION_CIRCLES)) {
    if (npcs.includes(npcId)) return circle;
  }
  return null;
};

const getCurrentReputation = (state, circle) => state?.reputation?.[circle] || 0;

export const adjustReputationForPublicDate = (state, npcId, locationKey) => {
  const circle = selectRelevantReputationCircle(npcId);
  if (!circle) return state.reputation || {};

  const currentRep = getCurrentReputation(state, circle);
  let newRep = currentRep;

  if (locationKey === 'club' && circle === 'nightlife') newRep += 2;
  if (locationKey === 'office' && circle === 'coworkers') newRep += 2;
  if (locationKey === 'library' && circle === 'academic') newRep += 2;

  return {
    ...(state.reputation || {}),
    [circle]: clamp(newRep)
  };
};

export const calculateGossipRisk = (state, npcId) => {
  const circle = selectRelevantReputationCircle(npcId);
  if (!circle) return 0;

  const rep = getCurrentReputation(state, circle);

  if (rep > 20) return 0.5; // High reputation -> higher gossip risk
  if (rep < -20) return 0.8; // Bad reputation -> high gossip risk
  return 0.1;
};

export const calculateRepairReputationModifier = (state, npcId) => {
  const circle = selectRelevantReputationCircle(npcId);
  if (!circle) return 1.0;

  const rep = getCurrentReputation(state, circle);

  if (rep > 20) return 1.2; // Easier to repair if well-liked in circle
  if (rep < -20) return 0.8; // Harder to repair if disliked in circle
  return 1.0;
};

export const calculateOrganicEncounterReputationDelta = (
  relationshipDelta,
  chemistryDelta = 0
) => {
  const socialImpact = relationshipDelta + Math.floor(chemistryDelta / 2);

  if (socialImpact >= 8) return 2;
  if (socialImpact >= 3) return 1;
  if (socialImpact <= -5) return -2;
  if (socialImpact < 0) return -1;
  return 0;
};

export const adjustReputationForOrganicEncounter = (
  state,
  npcId,
  relationshipDelta,
  chemistryDelta = 0
) => {
  const circle = selectRelevantReputationCircle(npcId);
  if (!circle) return state?.reputation || {};

  const reputationDelta = calculateOrganicEncounterReputationDelta(
    relationshipDelta,
    chemistryDelta
  );
  if (reputationDelta === 0) return state?.reputation || {};

  return {
    ...(state?.reputation || {}),
    [circle]: clamp(getCurrentReputation(state, circle) + reputationDelta)
  };
};
