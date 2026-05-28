import { RELATIONSHIP_REPAIR_ACTIONS } from '../data/npcs.js';

export const evaluateRepairAction = (state, npcId, matchData, actionId) => {
  const repairOptions = RELATIONSHIP_REPAIR_ACTIONS || [];
  const action = repairOptions.find(a => a.id === actionId);
  
  if (!action) return { success: false, reason: 'Invalid action' };
  
  // Generic gifts explicitly do not clear core conflicts
  if (action.isGiftShortcut) {
    return { success: false, reason: 'Gifts cannot substitute for emotional repair.' };
  }

  // Check stat requirements if any
  if (action.checkStat && state.stats[action.checkStat] < action.threshold) {
    return { success: false, reason: `Requires ${action.threshold} ${action.checkStat}` };
  }

  return { success: true, resolution: action.resolution };
};
