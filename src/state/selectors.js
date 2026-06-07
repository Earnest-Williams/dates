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

/**
 * Get compatibility signal for an NPC (internal use)
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @returns {Object} - { band: string, score: number }
 */
export const selectCompatibilitySignal = (state, npcId) => {
  const match = state.matches?.[npcId];
  if (!match || match.compatibilityScore === undefined) {
    return { band: 'unknown', score: null };
  }
  
  const score = match.compatibilityScore;
  if (score >= 70) return { band: 'strong', score };
  if (score >= 40) return { band: 'mixed', score };
  return { band: 'fragile', score };
};

/**
 * Get cohabitation fit hint for an NPC
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @returns {string} - Narrative hint about cohabitation fit
 */
export const selectCohabitationFitHint = (state, npcId) => {
  const match = state.matches?.[npcId];
  if (!match) return 'Unknown';
  
  const signal = selectCompatibilitySignal(state, npcId);
  
  if (signal.band === 'strong') {
    return 'You connect easily in quiet moments. Living together would feel natural.';
  }
  if (signal.band === 'mixed') {
    return 'You connect easily in quiet moments, but long-term ambition still feels unresolved.';
  }
  if (signal.band === 'fragile') {
    return 'Your lifestyles and values may clash. Cohabitation could be challenging.';
  }
  
  return 'Spend more time together to understand your compatibility.';
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

/**
 * Reputation System Selectors
 */

import { selectRelevantReputationCircle } from '../sim/reputation.js';

/**
 * Get reputation for a specific circle
 * @param {Object} state - Game state
 * @param {string} circle - Reputation circle name
 * @returns {number} - Reputation score (-100 to 100)
 */
export const selectReputation = (state, circle) => {
  return state.reputation?.[circle] || 0;
};

/**
 * Get reputation for an NPC's circle
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @returns {number} - Reputation score for the NPC's circle
 */
export const selectNpcReputation = (state, npcId) => {
  const circle = selectRelevantReputationCircle(npcId);
  if (!circle) return 0;
  return selectReputation(state, circle);
};

/**
 * Get all reputation circles with their scores
 * @param {Object} state - Game state
 * @returns {Object} - All reputation circles and their scores
 */
export const selectAllReputation = (state) => {
  return state.reputation || {};
};

/**
 * Get reputation hint for display
 * @param {Object} state - Game state
 * @param {string} circle - Reputation circle name
 * @returns {string} - Narrative description of reputation level
 */
export const selectReputationHint = (state, circle) => {
  const rep = selectReputation(state, circle);
  
  if (rep >= 50) return 'Well-respected';
  if (rep >= 20) return 'Liked';
  if (rep >= -20) return 'Neutral';
  if (rep >= -50) return 'Disliked';
  return 'Feared';
};

/**
 * Check if reputation spillover is enabled
 * @param {Object} state - Game state
 * @returns {boolean} - Whether reputation spillover is enabled
 */
export const isReputationSpilloverEnabled = (state) => {
  return state.features?.reputationSpillover === true;
};

/**
 * Get reputation circles that need attention
 * @param {Object} state - Game state
 * @returns {Array} - Circles with reputation < 0
 */
export const selectReputationWarnings = (state) => {
  const warnings = [];
  const rep = state.reputation || {};
  
  for (const [circle, score] of Object.entries(rep)) {
    if (score < 0) {
      warnings.push({ circle, score, hint: selectReputationHint(state, circle) });
    }
  }
  
  return warnings;
};
