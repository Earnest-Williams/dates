import { calculateMatchProbability } from '../sim/matching.js';
import { NPCS } from '../data/npcs.js';
import { formatTime, getDaypart } from '../sim/time.js';

export const getFormattedTime = (state) => {
  const { hour, minute } = state.time;
  return formatTime(hour, minute);
};

export const calculateMatchChance = (state, npcId) => {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return 0;
  return calculateMatchProbability(state.stats, npc, state.swipePreferences, state.swipePremium?.active) / 100;
};

export const checkActionFeasibility = (state, actionName, energyCost, moneyCost = 0) => {
  if (state.needs.energy < energyCost) {
    return { feasible: false, reason: "Too exhausted! You need sleep." };
  }
  if (state.stats.money < moneyCost) {
    return { feasible: false, reason: "Not enough money!" };
  }
  if (state.needs.hunger >= 95) {
    return { feasible: false, reason: "Starving! You must eat first." };
  }
  if (state.needs.health !== undefined && state.needs.health < 20) {
    return { feasible: false, reason: "Too sick! Visit the hospital first." };
  }

  const isWorkOrStudy = actionName.toLowerCase().includes('work') || actionName.toLowerCase().includes('study');
  if (isWorkOrStudy && state.needs.mood !== undefined && state.needs.mood < 30) {
    return { feasible: false, reason: "Too depressed! Do something fun first." };
  }

  return { feasible: true };
};

export const selectCompatibilityHintText = (state, npcId) => {
  const match = state.matches?.[npcId];
  if (!match || match.compatibilityScore === undefined) return 'Compatibility unknown. Spend more time together.';
  
  const score = match.compatibilityScore;
  if (score >= 70) return 'Strong long-term fit.';
  if (score >= 40) return 'Mixed long-term fit.';
  return 'Fragile long-term fit.';
};

export const selectProposalReadinessHint = (state, npcId) => {
  const match = state.matches?.[npcId];
  if (!match) return 'Unknown';
  if (match.storyTier < 3) return 'You need to build a much deeper connection first.';
  
  if (match.compatibilityScore !== undefined && match.compatibilityScore < 40) {
    return 'They have doubts about your long-term compatibility.';
  }
  
  return 'They seem ready whenever you are.';
};

import { getNpcEncounters, LOCATION_EVENTS } from '../data/townTexture.js';

export const selectCurrentLocationEncounters = (state, venueKey) => {
  return getNpcEncounters(state.time, venueKey);
};

export const selectAvailableOrganicEncounters = (state, venueKey) => {
  if (!state.features?.organicEncounters) return [];

  if (venueKey) {
    return selectCurrentLocationEncounters(state, venueKey);
  }

  return Object.keys(LOCATION_EVENTS).flatMap(v => selectCurrentLocationEncounters(state, v));
};

export const selectActiveLocationEvent = (state, locationKey) => {
  const event = LOCATION_EVENTS[locationKey];
  if (!event) return null;

  const timeOfDay = getDaypart(state.time?.hour ?? 8);
  if (event.times && !event.times.includes(timeOfDay)) return null;

  return event;
};

export const selectLocationRomanceHooks = (state, locationKey) => {
  const event = selectActiveLocationEvent(state, locationKey);
  return event ? event.romanceHooks : [];
};

export const selectLocationPublicVisibility = (state, locationKey, time) => {
  // If location is home, visibility is low
  if (locationKey === 'home') return 'private';

  const timeOfDay = getDaypart(time.hour ?? 8);
  const afterDark = timeOfDay === 'evening' || timeOfDay === 'night';
  if (locationKey === 'club' && afterDark) return 'high_visibility';
  if (locationKey === 'park' && !afterDark) return 'high_visibility';
  
  return 'moderate_visibility';
};

export const selectAvailableRoutinesByTimeBucket = (state) => {
  return getDaypart(state.time.hour);
};

export const selectPlannerWarnings = (state) => {
  const warnings = [];
  if (state.needs.energy < 30) warnings.push('You are exhausted.');
  if (state.needs.hunger >= 80) warnings.push('You are starving.');
  return warnings;
};

export const selectPlannerSocialOpportunities = (state) => {
  // Returns organic encounters + available dates
  return selectAvailableOrganicEncounters(state);
};

export const selectPlannerEconomicPressure = (state) => {
  const pressure = [];
  if (state.stats.money < state.living.billsAmount) pressure.push('Not enough money for rent.');
  if (state.stats.debt > 0) pressure.push(`You have $${state.stats.debt} in debt.`);
  return pressure;
};

export const selectPlannerRepairOpportunities = (state) => {
  const repairs = [];
  for (const [npcId, match] of Object.entries(state.matches)) {
    if (match.pendingRepairScene) repairs.push({ npcId, scene: match.pendingRepairScene });
  }
  return repairs;
};

import { calculateHomeStyleProfile, getNpcHomeStyleReaction } from '../data/furniture.js';

export const selectHomeStyleProfile = (state) => {
  return calculateHomeStyleProfile(state.placedFurniture || []);
};

export const selectHomeStyleFit = (state, npcId) => {
  return getNpcHomeStyleReaction(npcId, state.placedFurniture || []);
};

export const selectAvailableHomeScenes = () => {
  // Return scenes triggered by home identity
  return [];
};

export const selectHomeActivityDateOptions = (state) => {
  // Filter home activities available as dates
  return state.living?.availableHomeActivities || [];
};

export const selectHomeRepairOptions = () => {
  // Filter repair options available at home
  return [];
};

// ==========================================
// Phase 4: Relationship Journal Selectors
// ==========================================

export const selectNpcJournal = (state, npcId) => {
  return {
    memories: selectNpcRecentMemories(state, npcId),
    promises: selectNpcPromises(state, npcId),
    recentEvents: selectNpcRecentEvents(state, npcId),
    conflictBadge: selectNpcConflictBadge(state, npcId),
    compatibilityHint: selectNpcCompatibilityHint(state, npcId),
    suggestedNextStep: selectNpcSuggestedNextStep(state, npcId)
  };
};

export const selectNpcPromises = (state, npcId) => {
  const promises = state.relationshipMemory?.[npcId]?.promises || {};
  return Object.entries(promises).map(([key, status]) => ({ key, status }));
};

export const selectNpcConflictBadge = (state, npcId) => {
  const match = state.matches[npcId];
  if (match?.pendingRepairScene) return { type: 'repair_needed', scene: match.pendingRepairScene };
  if (match?.activeConflictId) return { type: 'active_conflict', id: match.activeConflictId };
  return null;
};

export const selectNpcRecentMemories = (state, npcId) => {
  const memory = state.relationshipMemory?.[npcId];
  if (!memory) return [];
  return [
    ...(memory.rememberedChoices || []).map(m => ({ type: 'choice', text: m })),
    ...(memory.comfortKnowns || []).map(m => ({ type: 'comfort', text: m }))
  ];
};

export const selectNpcCompatibilityHint = (state, npcId) => {
  const match = state.matches[npcId];
  if (!match || !state.compatibility) return { band: 'unknown', text: 'Spend more time together to understand your compatibility.' };
  
  const score = match.compatibilityScore || 50;
  let band = 'mixed';
  if (score > 70) band = 'strong';
  else if (score < 30) band = 'fragile';
  
  const hints = {
    strong: 'You connect easily and your long-term goals align nicely.',
    mixed: 'You have chemistry, but some long-term differences will require work.',
    fragile: 'You enjoy each other, but fundamental differences keep causing friction.'
  };
  
  return { band, text: hints[band] };
};

export const selectNpcRecentEvents = (state, npcId) => {
  return state.relationshipEvents?.[npcId] || [];
};

export const selectNpcSuggestedNextStep = (state, npcId) => {
  const badge = selectNpcConflictBadge(state, npcId);
  if (badge?.type === 'repair_needed') return 'Address the pending repair scene.';
  
  const match = state.matches[npcId];
  if (!match) return 'Go swipe on LinkUp!';
  if (match.relationship > 90 && !state.family?.married) return 'Consider proposing marriage.';
  if (match.relationship > 50 && !state.living?.roommateId) return 'Consider asking them to move in.';
  
  return 'Plan another date to build more memories.';
};
