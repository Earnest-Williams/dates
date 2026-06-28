import { SETTLEMENTS } from '../data/geography.js';

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

export const generateRumor = (state, npcId, locationKey, settlementId = 'Brockleigh') => {
  const settlement = SETTLEMENTS[settlementId];
  if (!settlement) return null;

  // Base bump-in chance based on population tier
  let bumpInChance = 0;
  if (settlement.popTier === 'Very Low') bumpInChance = 0.05;
  else if (settlement.popTier === 'Low') bumpInChance = 0.15;
  else if (settlement.popTier === 'Medium') bumpInChance = 0.35;
  else if (settlement.popTier === 'High') bumpInChance = 0.60;
  else if (settlement.popTier === 'Medium-High') bumpInChance = 0.45;
  else if (settlement.popTier === 'Low-Medium') bumpInChance = 0.25;

  if (Math.random() > bumpInChance) return null;

  // We got bumped into! Who saw us?
  // Pick a random circle from the player's active dating circles (excluding current date)
  const activeCircles = new Set();
  if (state.matches) {
    for (const [id, match] of Object.entries(state.matches)) {
      if (id !== npcId && match.relationship > 20) {
        const circle = selectRelevantReputationCircle(id);
        if (circle) activeCircles.add(circle);
      }
    }
  }
  
  // If no other active circles, they get spotted by the date's own circle
  if (activeCircles.size === 0) {
    const ownCircle = selectRelevantReputationCircle(npcId);
    if (ownCircle) activeCircles.add(ownCircle);
    else return null;
  }

  const circlesArray = Array.from(activeCircles);
  const witnessCircle = circlesArray[Math.floor(Math.random() * circlesArray.length)];

  return {
    targetNpcId: npcId,
    witnessCircle,
    locationKey,
    settlementId,
    discoveredDay: state.time?.day || 1,
    daysUntilMature: 2
  };
};

export const processPendingRumors = (state, daysPassed = 1) => {
  if (!state.reputation) return state;
  const pending = state.reputation.pendingRumors || [];
  const active = state.reputation.activeRumors || [];
  
  if (pending.length === 0) return state;

  const newPending = [];
  const newActive = [...active];

  for (const rumor of pending) {
    const updatedRumor = { ...rumor, daysUntilMature: rumor.daysUntilMature - daysPassed };
    if (updatedRumor.daysUntilMature <= 0) {
      newActive.push(updatedRumor);
    } else {
      newPending.push(updatedRumor);
    }
  }

  return {
    ...state,
    reputation: {
      ...state.reputation,
      pendingRumors: newPending,
      activeRumors: newActive
    }
  };
};
