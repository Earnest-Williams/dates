import { RELATIONSHIP_CONFLICT_TRIGGERS } from '../data/npcs.js';

export const evaluateConflictTriggers = (state, npcId, currentMatch, eventType, eventData) => {
  // Pure function to evaluate if a conflict should trigger
  const triggers = RELATIONSHIP_CONFLICT_TRIGGERS || [];
  
  for (const trigger of triggers) {
    if (trigger.npcId && trigger.npcId !== npcId) continue;
    if (trigger.type !== eventType) continue;
    
    // Example: checking if relationship is high enough
    if (trigger.minRelationship && currentMatch.relationship < trigger.minRelationship) continue;

    // Check custom condition if any
    if (trigger.condition && !trigger.condition(state, currentMatch, eventData)) continue;

    return { triggered: true, conflictId: trigger.id, scene: trigger.scene };
  }

  return { triggered: false };
};
