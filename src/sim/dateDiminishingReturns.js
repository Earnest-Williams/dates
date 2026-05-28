export const applyDateDiminishingReturns = (relGain, chemChange, npcId, dateType, relationshipMemory) => {
  const memory = relationshipMemory?.[npcId];
  if (!memory || !memory.sharedActivities) return { relGain, chemChange };

  // Penalize repetitive optimal dates
  const recentActivities = memory.sharedActivities.filter(a => a === `date_${dateType}`);
  if (recentActivities.length >= 2) {
    return {
      relGain: Math.max(0, Math.floor(relGain * 0.5)),
      chemChange: Math.max(0, Math.floor(chemChange * 0.5)),
      diminished: true
    };
  }

  return { relGain, chemChange, diminished: false };
};
