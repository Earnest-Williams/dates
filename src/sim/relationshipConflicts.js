/**
 * Relationship Conflict System
 * 
 * Implements conflict triggers based on game events and relationship state.
 * Conflicts are first-class state that must be resolved through repair actions.
 */

import { NPCS } from '../data/npcs.js';

/**
 * Conflict trigger types
 */
export const CONFLICT_TRIGGER_TYPES = {
  IGNORED_MESSAGES: 'ignored_messages',
  MISSED_PLANNED_DATE: 'missed_planned_date',
  POOR_DATE_ENDING: 'poor_date_ending',
  BROKEN_PROMISE: 'broken_promises',
  LOW_MOOD_SPILLOVER: 'low_mood',
  AMBITION_MISMATCH: 'ambition_mismatch',
  HOME_LIFESTYLE_MISMATCH: 'home_lifestyle_mismatch',
  JEALOUSY_SOCIAL_REPUTATION: 'jealousy_social_reputation',
  REPEATED_INATTENTIVE_DIALOGUE: 'repeated_inattentive_dialogue',
  PUBLIC_DATE_WITH_ANOTHER: 'public_date_with_another',
  COMPATIBILITY_MISMATCH: 'major_compatibility_mismatch',
};

/**
 * Get eligible conflict triggers for a given state and NPC
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @returns {Array} - Array of conflict trigger objects
 */
export const getEligibleConflictTriggers = (state, npcId) => {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return [];

  const matchData = state.matches?.[npcId] || {};
  const currentDay = state.time?.day || 1;
  const playerMood = state.needs?.mood || 100;
  const playerStats = state.stats || {};
  const npcCompatibility = state.compatibility?.npcTraits?.[npcId];
  const playerCompatibility = state.compatibility?.playerTraits || {};

  const triggers = [];

  // Trigger 1: Ignored messages
  // Check if player has ignored messages from this NPC
  const messageHistory = state.relationshipMemory?.[npcId]?.messages || [];
  const ignoredMessages = messageHistory.filter(m => m.ignored).length;
  if (ignoredMessages >= 3) {
    triggers.push({
      id: 'ignored_messages',
      type: CONFLICT_TRIGGER_TYPES.IGNORED_MESSAGES,
      npcId,
      severity: Math.min(3, Math.floor(ignoredMessages / 2)),
      reason: `Ignored ${ignoredMessages} messages from ${npc.name}`,
      repairHint: 'Apologize and explain why you were unavailable',
    });
  }

  // Trigger 2: Missed planned date
  // Check if there's a planned date that was missed
  const plannedDate = state.calendar?.events?.find(e => 
    e.type === 'date' && 
    e.npcId === npcId && 
    e.day <= currentDay && 
    !e.completed
  );
  if (plannedDate) {
    triggers.push({
      id: 'missed_planned_date',
      type: CONFLICT_TRIGGER_TYPES.MISSED_PLANNED_DATE,
      npcId,
      severity: 2,
      reason: `Missed planned date with ${npc.name} on day ${plannedDate.day}`,
      repairHint: 'Follow through on rescheduling the date',
    });
  }

  // Trigger 3: Poor date ending
  // Check if last date had poor quality
  if (matchData.lastDateQuality !== undefined && matchData.lastDateQuality < 30) {
    triggers.push({
      id: 'poor_date_ending',
      type: CONFLICT_TRIGGER_TYPES.POOR_DATE_ENDING,
      npcId,
      severity: 2,
      reason: `Last date with ${npc.name} ended poorly (quality: ${matchData.lastDateQuality})`,
      repairHint: 'Choose a thoughtful activity for the next date',
    });
  }

  // Trigger 4: Broken promise
  // Check for pending promises that haven't been fulfilled
  const memory = state.relationshipMemory?.[npcId] || {};
  const pendingPromises = Object.entries(memory.promises || {})
    .filter(([_, status]) => status === 'pending')
    .map(([key]) => key);
  
  if (pendingPromises.length >= 2) {
    triggers.push({
      id: 'broken_promises',
      type: CONFLICT_TRIGGER_TYPES.BROKEN_PROMISE,
      npcId,
      severity: Math.min(3, pendingPromises.length),
      reason: `Broken or unfulfilled promises: ${pendingPromises.join(', ')}`,
      repairHint: 'Follow through on previous promises',
    });
  }

  // Trigger 5: Low mood spillover
  // Player's low mood affects the relationship
  if (playerMood < 30) {
    triggers.push({
      id: 'low_mood',
      type: CONFLICT_TRIGGER_TYPES.LOW_MOOD_SPILLOVER,
      npcId,
      severity: 1,
      reason: `Player's low mood (${playerMood}) is affecting the relationship`,
      repairHint: 'Improve your mood before interacting',
    });
  }

  // Trigger 6: Ambition mismatch
  // Check if player's career stats don't match NPC's expectations
  if (npc.archetype === 'EXECUTIVE' && playerStats.corporate < 30) {
    triggers.push({
      id: 'ambition_mismatch',
      type: CONFLICT_TRIGGER_TYPES.AMBITION_MISMATCH,
      npcId,
      severity: 2,
      reason: `${npc.name} expects higher career ambition (corporate: ${playerStats.corporate})`,
      repairHint: 'Improve your career stats to match their expectations',
    });
  } else if (npc.archetype === 'SCHOLAR' && playerStats.intelligence < 30) {
    triggers.push({
      id: 'ambition_mismatch',
      type: CONFLICT_TRIGGER_TYPES.AMBITION_MISMATCH,
      npcId,
      severity: 2,
      reason: `${npc.name} expects higher intellectual ambition (intelligence: ${playerStats.intelligence})`,
      repairHint: 'Improve your intelligence to match their expectations',
    });
  }

  // Trigger 7: Home lifestyle mismatch
  // Check if player's housing doesn't match NPC's preferences
  const housingTier = playerStats.housingTier || 1;
  if (npc.homeReaction) {
    const homeFit = npc.homeReaction.fit;
    if (homeFit === 'uncomfortable' || homeFit === 'mismatch') {
      triggers.push({
        id: 'home_lifestyle_mismatch',
        type: CONFLICT_TRIGGER_TYPES.HOME_LIFESTYLE_MISMATCH,
        npcId,
        severity: 1,
        reason: `${npc.name} is uncomfortable with your home (${homeFit})`,
        repairHint: 'Upgrade your housing or change your home style',
      });
    }
  }

  // Trigger 8: Jealousy/social reputation
  // Check if player has been on dates with multiple NPCs recently
  const recentDates = Object.entries(state.matches || {})
    .filter(([id, match]) => id !== npcId && match.lastDateDay !== null && match.lastDateDay >= (currentDay - 7))
    .length;
  
  if (recentDates >= 3 && matchData.exclusivityExpectation === 'exclusive') {
    triggers.push({
      id: 'jealousy_social_reputation',
      type: CONFLICT_TRIGGER_TYPES.JEALOUSY_SOCIAL_REPUTATION,
      npcId,
      severity: 2,
      reason: `${npc.name} is jealous of your other dates (${recentDates} in last 7 days)`,
      repairHint: 'Spend quality time exclusively with this NPC',
    });
  }

  // Trigger 9: Repeated inattentive dialogue
  // Check if player has made many low-effort dialogue choices
  const dialogueChoices = memory.rememberedChoices || [];
  const lowEffortChoices = dialogueChoices.filter(c => 
    c.includes('ignored') || c.includes('rushed') || c.includes('dismissed')
  ).length;
  
  if (lowEffortChoices >= 3) {
    triggers.push({
      id: 'repeated_inattentive_dialogue',
      type: CONFLICT_TRIGGER_TYPES.REPEATED_INATTENTIVE_DIALOGUE,
      npcId,
      severity: 2,
      reason: `Repeated inattentive dialogue choices (${lowEffortChoices} low-effort choices)`,
      repairHint: 'Be more attentive in future conversations',
    });
  }

  // Trigger 10: Public date with another NPC after exclusivity
  // This is checked when a date is initiated, not here

  // Trigger 11: Major compatibility mismatch at tier transition
  if (matchData.storyTier >= 2 && npcCompatibility && playerCompatibility) {
    // Calculate compatibility score
    const compatibilityScore = calculateCompatibilityScore(playerCompatibility, npcCompatibility);
    if (compatibilityScore < 40) {
      triggers.push({
        id: 'major_compatibility_mismatch',
        type: CONFLICT_TRIGGER_TYPES.COMPATIBILITY_MISMATCH,
        npcId,
        severity: 3,
        reason: `Major compatibility mismatch at tier ${matchData.storyTier} (score: ${compatibilityScore})`,
        repairHint: 'Re-evaluate long-term compatibility',
      });
    }
  }

  return triggers;
};

/**
 * Calculate compatibility score between player and NPC
 * @param {Object} playerTraits - Player compatibility traits
 * @param {Object} npcTraits - NPC compatibility traits
 * @returns {number} - Compatibility score (0-100)
 */
export const calculateCompatibilityScore = (playerTraits = {}, npcTraits = {}) => {
  // Simple implementation - can be enhanced
  const traitKeys = Object.keys(playerTraits);
  if (traitKeys.length === 0) return 50;

  let matches = 0;
  let total = 0;

  for (const key of traitKeys) {
    if (npcTraits[key] && playerTraits[key] === npcTraits[key]) {
      matches++;
    }
    total++;
  }

  return Math.round((matches / total) * 100);
};

/**
 * Start a conflict for an NPC
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @param {string} conflictId - Conflict identifier
 * @param {Object} options - Additional options
 * @returns {Object} - Updated match data
 */
export const startConflict = (state, npcId, conflictId, options = {}) => {
  const matchData = state.matches?.[npcId] || {};
  const currentDay = state.time?.day || 1;

  return {
    ...matchData,
    activeConflictId: conflictId,
    conflictStartedDay: currentDay,
    pendingRepairScene: options.repairScene || null,
    relationshipStage: 'conflict',
  };
};

/**
 * Check if a conflict should be triggered based on date outcome
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @param {Object} dateOutcome - Date outcome data
 * @returns {Object} - { shouldTrigger: boolean, conflictId: string, repairScene: string }
 */
export const checkDateConflictTrigger = (state, npcId, dateOutcome) => {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return { shouldTrigger: false };

  const matchData = state.matches?.[npcId] || {};
  const qualityScore = dateOutcome.qualityScore || dateOutcome.finalVibe || 0;

  // Poor date ending trigger
  if (qualityScore < 30 && !matchData.activeConflictId) {
    return {
      shouldTrigger: true,
      conflictId: 'poor_date_ending',
      repairScene: npc.repairEvent?.id || null,
    };
  }

  // Conflict from date outcome
  if (dateOutcome.conflict && !matchData.activeConflictId) {
    return {
      shouldTrigger: true,
      conflictId: dateOutcome.conflict,
      repairScene: dateOutcome.repairScene || npc.repairEvent?.id || null,
    };
  }

  return { shouldTrigger: false };
};

/**
 * Evaluate all conflict triggers and return the most severe one
 * @param {Object} state - Game state
 * @param {string} npcId - NPC identifier
 * @returns {Object} - { triggered: boolean, conflictId: string, severity: number, repairScene: string }
 */
export const evaluateConflictTriggers = (state, npcId, eventType, eventData) => {
  const triggers = getEligibleConflictTriggers(state, npcId);
  
  if (triggers.length === 0) {
    return { triggered: false };
  }

  // Find the most severe trigger
  const mostSevere = triggers.reduce((a, b) => a.severity > b.severity ? a : b);

  const npc = NPCS.find(n => n.id === npcId);
  const repairScene = npc?.repairEvent?.id || null;

  return {
    triggered: true,
    conflictId: mostSevere.id,
    severity: mostSevere.severity,
    reason: mostSevere.reason,
    repairScene,
    repairHint: mostSevere.repairHint,
  };
};
