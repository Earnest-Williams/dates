/**
 * Date Diminishing Returns System
 * 
 * Implements repetition penalties to prevent farming relationships through repeated optimal dates.
 * Key rules:
 * - Same NPC + same date type within 7 days: 50% reduction (stacking with more repetitions)
 * - Same date type with same NPC more than 3 times total: additional penalties
 * - Low-effort dates (low connection scores) increase boredom
 * - Callback-driven dates bypass 50% of repetition penalty
 * - Repair dates addressing active conflicts bypass repetition penalty
 * - High compatibility softens penalties but doesn't eliminate them
 */

/**
 * Calculate diminishing returns for repeated dates
 * @param {number} relGain - Base relationship gain
 * @param {number} chemChange - Base chemistry change
 * @param {string} npcId - NPC identifier
 * @param {string} dateType - Type of date (e.g., 'library_date', 'park_walk')
 * @param {Object} relationshipMemory - Memory state for relationships
 * @param {Object} matchData - Current match data for this NPC
 * @param {number} connectionScore - Final connection score from the date
 * @param {boolean} isCallbackDate - Whether this date fulfills a callback
 * @param {boolean} isRepairDate - Whether this date addresses an active conflict
 * @param {number} compatibilityScore - Compatibility score (0-100)
 * @returns {Object} - { relGain, chemChange, diminished, penaltyReason, penaltyAmount }
 */
export const applyDateDiminishingReturns = (
  relGain,
  chemChange,
  npcId,
  dateType,
  relationshipMemory,
  matchData = {},
  connectionScore = 0,
  isCallbackDate = false,
  isRepairDate = false,
  compatibilityScore = 50
) => {
  // No penalties if gains are zero or negative
  if (relGain <= 0 && chemChange <= 0) {
    return { relGain, chemChange, diminished: false, penaltyReason: null, penaltyAmount: 0 };
  }

  const memory = relationshipMemory?.[npcId] || {};
  const currentDay = matchData.currentDay;
  const lastDateDay = matchData.lastDateDay;
  const dateHistory = matchData.dateHistory || [];
  
  // Track date history for this NPC
  const dateTypeHistory = dateHistory.filter(d => d.dateType === dateType);
  const recentDateTypeHistory = dateTypeHistory.filter(d => 
    currentDay && d.day && (currentDay - d.day) <= 7
  );

  let penaltyMultiplier = 1.0;
  let penaltyReason = null;
  let penaltyAmount = 0;
  let diminished = false;

  // Rule 1: Same date type with same NPC within 7 days
  if (recentDateTypeHistory.length >= 1) {
    // First repetition within 7 days: 50% penalty
    // Second repetition within 7 days: 75% penalty (25% of original)
    // Third+ repetition within 7 days: 87.5% penalty (12.5% of original)
    const repetitionCount = recentDateTypeHistory.length;
    const basePenalty = 0.5;
    const stackingPenalty = 1 - (0.5 ** repetitionCount);
    
    penaltyMultiplier *= (1 - stackingPenalty);
    penaltyReason = `repeated_${dateType}_within_7_days`;
    penaltyAmount = Math.floor((relGain + chemChange) * stackingPenalty);
    diminished = true;
  }

  // Rule 2: Same date type with same NPC more than 3 times total (lifetime)
  if (dateTypeHistory.length >= 3) {
    const lifetimePenalty = 0.25; // Additional 25% penalty
    penaltyMultiplier *= (1 - lifetimePenalty);
    penaltyReason = penaltyReason ? `${penaltyReason}_and_lifetime_repetition` : `lifetime_repetition_${dateType}`;
    penaltyAmount += Math.floor((relGain + chemChange) * lifetimePenalty);
    diminished = true;
  }

  // Rule 3: Low connection scores increase boredom penalty
  if (connectionScore < 30) {
    const boredomPenalty = 0.2; // 20% additional penalty for low-effort dates
    penaltyMultiplier *= (1 - boredomPenalty);
    penaltyReason = penaltyReason ? `${penaltyReason}_and_low_connection` : `low_connection_boredom`;
    penaltyAmount += Math.floor((relGain + chemChange) * boredomPenalty);
    diminished = true;
  }

  // Apply compatibility softening (but don't eliminate penalties entirely)
  if (compatibilityScore >= 70) {
    // High compatibility: reduce penalties by 30%
    const compatibilityBonus = 0.3;
    penaltyMultiplier = Math.min(1.0, penaltyMultiplier * (1 + compatibilityBonus));
  } else if (compatibilityScore < 40) {
    // Low compatibility: increase penalties by 20%
    penaltyMultiplier *= 0.8;
  }

  // Bypass rules
  if (isCallbackDate) {
    // Callback-driven dates bypass 50% of the penalty
    penaltyMultiplier = 1 - ((1 - penaltyMultiplier) * 0.5);
    penaltyAmount = Math.floor(penaltyAmount * 0.5);
  }

  if (isRepairDate) {
    // Repair dates addressing active conflicts bypass repetition penalty entirely
    penaltyMultiplier = 1.0;
    penaltyAmount = 0;
    diminished = false;
  }

  // Calculate final values
  const finalRelGain = Math.max(0, Math.floor(relGain * penaltyMultiplier));
  const finalChemChange = Math.max(0, Math.floor(chemChange * penaltyMultiplier));

  return {
    relGain: finalRelGain,
    chemChange: finalChemChange,
    diminished,
    penaltyReason,
    penaltyAmount: Math.max(0, (relGain + chemChange) - (finalRelGain + finalChemChange))
  };
};

/**
 * Check if a date type has been repeated too frequently
 * @param {Object} matchData - Current match data
 * @param {string} dateType - Date type to check
 * @returns {Object} - { isRepeated: boolean, recentCount: number, totalCount: number }
 */
export const checkDateRepetition = (matchData = {}, dateType) => {
  const dateHistory = matchData.dateHistory || [];
  const currentDay = matchData.currentDay;
  
  const dateTypeHistory = dateHistory.filter(d => d.dateType === dateType);
  const recentDateTypeHistory = dateTypeHistory.filter(d => 
    currentDay && d.day && (currentDay - d.day) <= 7
  );

  return {
    isRepeated: recentDateTypeHistory.length >= 1,
    recentCount: recentDateTypeHistory.length,
    totalCount: dateTypeHistory.length
  };
};

/**
 * Record a date in the match history
 * @param {Object} matchData - Current match data
 * @param {string} dateType - Date type that occurred
 * @param {number} day - Current day
 * @returns {Object} - Updated match data with recorded date
 */
export const recordDateInHistory = (matchData = {}, dateType, day) => {
  const dateHistory = matchData.dateHistory || [];
  
  return {
    ...matchData,
    dateHistory: [
      { dateType, day },
      ...dateHistory
    ].slice(0, 20), // Keep last 20 dates
    lastDateDay: day,
    lastDateType: dateType
  };
};
